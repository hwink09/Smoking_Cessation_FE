import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Card, Typography, Spin } from "antd";
import { CrownFilled } from "@ant-design/icons";
import badgeService from "~/services/badgeService";


const { Text } = Typography;

// Hàm chuyển đổi dữ liệu cho từng bảng
const mapRankingData = (data, type) => {
  return (data || []).map((item, idx) => ({
    key: item.user?._id || idx,
    avatar: item.user?.avatar_url,
    name: item.user?.name,
    email: item.user?.email || "",
    badges: item.badges || [],
    badgeCount: type === "badge_count" ? item.score : item.badgeCount || item.badges?.length || 0,
    totalPoints: type === "points" ? item.score : undefined,
    noSmokeDays: type === "no_smoke_days" ? item.score : undefined,
    moneySaved: type === "money_saved" ? item.score : undefined,
    score: item.score,
    // ...các trường khác nếu cần
  }));
};

// Cột chung cho các bảng
const baseColumns = [
  {
    title: "#",
    dataIndex: "rank",
    key: "rank",
    render: (_, __, idx) => (
      idx === 0 ? <CrownFilled style={{ color: '#fadb14', fontSize: 22 }} /> : idx + 1
    ),
    width: 60,
    align: "center",
  },
  {
    title: "Thành viên",
    dataIndex: "avatar",
    key: "avatar",
    render: (_, record) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar size={48} src={record.avatar} />
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          {record.email && <Text type="secondary" style={{ fontSize: 13 }}>{record.email}</Text>}
        </div>
      </div>
    ),
  },
];

const getColumns = (type) => {
  let valueCol;
  let valueTitle;
  let valueRender = (val) => <Text strong style={{ color: '#52c41a', fontSize: 18 }}>{val}</Text>;
  switch (type) {
    case "points":
      valueCol = "totalPoints";
      valueTitle = "Tổng điểm";
      break;
    case "no_smoke_days":
      valueCol = "noSmokeDays";
      valueTitle = "Số ngày không hút";
      break;
    case "money_saved":
      valueCol = "moneySaved";
      valueTitle = "Số tiền tiết kiệm";
      valueRender = (val) => <Text strong style={{ color: '#52c41a', fontSize: 18 }}>{val?.toLocaleString()} đ</Text>;
      break;
    case "badge_count":
      valueCol = "badgeCount";
      valueTitle = "Số huy hiệu";
      valueRender = (val) => <Text strong style={{ color: '#faad14', fontSize: 18 }}>{val}</Text>;
      break;
    default:
      valueCol = "score";
      valueTitle = "Điểm";
  }
  return [
    ...baseColumns,
    {
      title: valueTitle,
      dataIndex: valueCol,
      key: valueCol,
      render: valueRender,
      align: "center",
    },
  ];
};

const Ranking = () => {
  const [pointsRanking, setPointsRanking] = useState([]);
  const [noSmokeDaysRanking, setNoSmokeDaysRanking] = useState([]);
  const [moneySavedRanking, setMoneySavedRanking] = useState([]);
  const [badgeCountRanking, setBadgeCountRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      const [response, response2, response3, response4] = await Promise.all([
        badgeService.getRankingBadges("points"),
        badgeService.getRankingBadges("no_smoke_days"),
        badgeService.getRankingBadges("money_saved"),
        badgeService.getRankingBadges("badge_count"),
      ]);
      // console.log("response", response, response2, response3, response4);
      setPointsRanking(mapRankingData(response, "points"));
      setNoSmokeDaysRanking(mapRankingData(response2, "no_smoke_days"));
      setMoneySavedRanking(mapRankingData(response3, "money_saved"));
      setBadgeCountRanking(mapRankingData(response4, "badge_count"));
      setLoading(false);
    };
    fetchRanking();
  }, []);

  return (
    <div className="bg-white" style={{ margin: "40px auto", padding: 24, backgroundColor: "#fff"}}>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2", marginBottom: 32 }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
          <CrownFilled style={{ color: '#fadb14', marginRight: 8 }} />Bảng xếp hạng theo tổng điểm
        </h2>
        <Spin spinning={loading}>
          <Table
            columns={getColumns("points")}
            dataSource={pointsRanking}
            rowKey={"key"}
            pagination={false}
            bordered
            size="middle"
          />
        </Spin>
      </Card>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2", marginBottom: 32 }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
          <CrownFilled style={{ color: '#1890ff', marginRight: 8 }} />Bảng xếp hạng số ngày không hút thuốc
        </h2>
        <Spin spinning={loading}>
          <Table
            columns={getColumns("no_smoke_days")}
            dataSource={noSmokeDaysRanking}
            rowKey={"key"}
            pagination={false}
            bordered
            size="middle"
          />
        </Spin>
      </Card>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2", marginBottom: 32 }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
          <CrownFilled style={{ color: '#52c41a', marginRight: 8 }} />Bảng xếp hạng số tiền tiết kiệm
        </h2>
        <Spin spinning={loading}>
          <Table
            columns={getColumns("money_saved")}
            dataSource={moneySavedRanking}
            rowKey={"key"}
            pagination={false}
            bordered
            size="middle"
          />
        </Spin>
      </Card>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2", marginBottom: 32 }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
          <CrownFilled style={{ color: '#faad14', marginRight: 8 }} />Bảng xếp hạng số huy hiệu
        </h2>
        <Spin spinning={loading}>
          <Table
            columns={getColumns("badge_count")}
            dataSource={badgeCountRanking}
            rowKey={"key"}
            pagination={false}
            bordered
            size="middle"
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Ranking;