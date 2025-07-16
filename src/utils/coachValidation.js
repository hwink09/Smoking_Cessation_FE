import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with the plugin
dayjs.extend(isSameOrBefore);

/**
 * Validation utilities for coach stage management
 */

/**
 * Validate stage sequence and overlapping
 * @param {string} startDate - Start date of new stage
 * @param {string} endDate - End date of new stage
 * @param {string} planId - Plan ID
 * @param {Function} fetchStagesByPlanId - Function to fetch stages
 * @returns {Object} - Validation result
 */
export const validateStageSequence = async (
  startDate,
  endDate,
  planId,
  fetchStagesByPlanId
) => {
  try {
    // Validate basic date logic
    if (new Date(startDate) >= new Date(endDate)) {
      return {
        valid: false,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      };
    }

    // Get existing stages for the plan
    const stages = await fetchStagesByPlanId(planId);

    if (!stages || stages.length === 0) {
      return { valid: true };
    }

    // Sort stages by end date to find the latest one
    const sortedStages = stages.sort(
      (a, b) => new Date(b.end_date) - new Date(a.end_date)
    );

    const latestStage = sortedStages[0];

    // Check if new stage starts after the latest stage ends
    if (new Date(startDate) <= new Date(latestStage.end_date)) {
      return {
        valid: false,
        message: `Ngày bắt đầu giai đoạn mới phải sau ngày kết thúc giai đoạn gần nhất (${dayjs(
          latestStage.end_date
        ).format("DD/MM/YYYY")})`,
      };
    }

    // Check for overlapping dates with any existing stage
    const hasOverlap = stages.some((stage) => {
      const stageStart = new Date(stage.start_date);
      const stageEnd = new Date(stage.end_date);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return (
        (newStart >= stageStart && newStart <= stageEnd) ||
        (newEnd >= stageStart && newEnd <= stageEnd) ||
        (newStart <= stageStart && newEnd >= stageEnd)
      );
    });

    if (hasOverlap) {
      return {
        valid: false,
        message: "Giai đoạn mới không được trùng lặp với giai đoạn hiện có",
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("Stage validation error:", error);
    return {
      valid: false,
      message: "Lỗi khi kiểm tra thông tin giai đoạn",
    };
  }
};

/**
 * Get next stage number
 * @param {string} planId - Plan ID
 * @param {Function} fetchStagesByPlanId - Function to fetch stages
 * @returns {number} - Next stage number
 */
export const getNextStageNumber = async (planId, fetchStagesByPlanId) => {
  try {
    const stages = await fetchStagesByPlanId(planId);
    if (!stages || stages.length === 0) return 1;

    const maxStageNumber = Math.max(
      ...stages.map((stage) => stage.stage_number || 0)
    );

    return maxStageNumber + 1;
  } catch (error) {
    console.error("Get next stage number error:", error);
    return 1;
  }
};

/**
 * Get suggested start date for a new stage
 * @param {Object} lastStageInfo - Information about the last stage
 * @returns {dayjs.Dayjs} - Suggested start date
 */
export const getSuggestedStartDate = (lastStageInfo) => {
  if (lastStageInfo) {
    // Suggest next day after last stage end date
    return dayjs(lastStageInfo.endDate).add(1, "day");
  }
  // Default to tomorrow for first stage
  return dayjs().add(1, "day");
};

/**
 * Validate stage title
 * @param {string} title - Stage title
 * @returns {Object} - Validation result
 */
export const validateStageTitle = (title) => {
  if (!title?.trim()) {
    return { isValid: false, message: "Vui lòng nhập tiêu đề" };
  }
  if (title.length < 3) {
    return { isValid: false, message: "Tiêu đề phải có ít nhất 3 ký tự" };
  }
  if (title.length > 100) {
    return { isValid: false, message: "Tiêu đề không được vượt quá 100 ký tự" };
  }
  return { isValid: true };
};

/**
 * Validate stage description
 * @param {string} description - Stage description
 * @returns {Object} - Validation result
 */
export const validateStageDescription = (description) => {
  if (!description?.trim()) {
    return { isValid: false, message: "Vui lòng nhập mô tả" };
  }
  if (description.length < 10) {
    return { isValid: false, message: "Mô tả phải có ít nhất 10 ký tự" };
  }
  if (description.length > 500) {
    return { isValid: false, message: "Mô tả không được vượt quá 500 ký tự" };
  }
  return { isValid: true };
};

/**
 * Create end date validator for Ant Design Form
 * @param {Object} stageForm - Ant Design form instance
 * @returns {Function} - Validator function
 */
export const createEndDateValidator = (stageForm) => {
  return (_, value) => {
    if (!value) return Promise.reject(new Error("Chọn ngày kết thúc"));

    const startDate = stageForm.getFieldValue("start_date");
    if (startDate && dayjs(value).isBefore(dayjs(startDate))) {
      return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu"));
    }

    return Promise.resolve();
  };
};

/**
 * Create start date validator for Ant Design Form
 * @param {Object} stageForm - Ant Design form instance
 * @param {Object} lastStageInfo - Information about the last stage
 * @returns {Function} - Validator function
 */
export const createStartDateValidator = (stageForm, lastStageInfo) => {
  return (_, value) => {
    if (!value) return Promise.reject(new Error("Chọn ngày bắt đầu"));

    const endDate = stageForm.getFieldValue("end_date");
    if (endDate && dayjs(value).isAfter(dayjs(endDate))) {
      return Promise.reject(new Error("Ngày bắt đầu phải trước ngày kết thúc"));
    }

    // Validate against last stage if exists
    if (lastStageInfo) {
      const lastEndDate = dayjs(lastStageInfo.endDate);
      if (dayjs(value).isSameOrBefore(lastEndDate)) {
        return Promise.reject(
          new Error(
            `Ngày bắt đầu phải sau ${lastEndDate.format(
              "DD/MM/YYYY"
            )} (ngày kết thúc giai đoạn ${lastStageInfo.stageNumber})`
          )
        );
      }
    }

    return Promise.resolve();
  };
};

/**
 * Get disabled dates for start date picker
 * @param {Object} lastStageInfo - Information about the last stage
 * @returns {Function} - Disabled date function for DatePicker
 */
export const getDisabledStartDates = (lastStageInfo) => {
  return (current) => {
    // Disable dates before last stage end date
    if (lastStageInfo) {
      return (
        current && dayjs(current).isSameOrBefore(dayjs(lastStageInfo.endDate))
      );
    }
    return false;
  };
};

/**
 * Get placeholder text for start date picker
 * @param {Object} lastStageInfo - Information about the last stage
 * @returns {string} - Placeholder text
 */
export const getStartDatePlaceholder = (lastStageInfo) => {
  if (lastStageInfo) {
    return `Sau ${dayjs(lastStageInfo.endDate).format("DD/MM/YYYY")}`;
  }
  return "Chọn ngày bắt đầu";
};

/**
 * Validate complete stage form data
 * @param {Object} formData - Form data to validate
 * @param {Object} lastStageInfo - Information about the last stage
 * @returns {Object} - Validation result with errors
 */
export const validateStageForm = (formData, lastStageInfo) => {
  const errors = {};

  // Validate title
  const titleValidation = validateStageTitle(formData.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.message;
  }

  // Validate description
  const descriptionValidation = validateStageDescription(formData.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.message;
  }

  // Validate dates
  if (!formData.start_date) {
    errors.start_date = "Vui lòng chọn ngày bắt đầu";
  } else if (lastStageInfo) {
    const startDate = dayjs(formData.start_date);
    const lastEndDate = dayjs(lastStageInfo.endDate);
    if (startDate.isSameOrBefore(lastEndDate)) {
      errors.start_date = `Ngày bắt đầu phải sau ${lastEndDate.format(
        "DD/MM/YYYY"
      )}`;
    }
  }

  if (!formData.end_date) {
    errors.end_date = "Vui lòng chọn ngày kết thúc";
  } else if (formData.start_date && formData.end_date) {
    const startDate = dayjs(formData.start_date);
    const endDate = dayjs(formData.end_date);
    if (endDate.isBefore(startDate)) {
      errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format stage info for display
 * @param {Object} stageInfo - Stage information
 * @returns {string} - Formatted stage info
 */
export const formatStageInfo = (stageInfo) => {
  if (!stageInfo) return "";

  return `"${stageInfo.title}" (Giai đoạn ${
    stageInfo.stageNumber
  }) kết thúc vào ${dayjs(stageInfo.endDate).format("DD/MM/YYYY")}`;
};

/**
 * Generate stage creation rules for Ant Design Form
 * @returns {Object} - Form rules object
 */
export const getStageFormRules = () => {
  return {
    title: [
      { required: true, message: "Vui lòng nhập tiêu đề" },
      { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
      { max: 100, message: "Tiêu đề không được vượt quá 100 ký tự" },
    ],
    description: [
      { required: true, message: "Vui lòng nhập mô tả" },
      { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
      { max: 500, message: "Mô tả không được vượt quá 500 ký tự" },
    ],
  };
};
