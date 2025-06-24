import { useState } from "react"
import { ArrowLeft, Save, Eye, ImageIcon, Tag, FileText } from "lucide-react"

const CreateBlog = ({ onSubmit, onCancel, tags = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tag: "",
  })
  
  const [preview, setPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTagChange = (e) => {
    setFormData((prev) => ({ ...prev, tag: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.content && formData.title) {
      try {
        setIsSubmitting(true)
        setError(null)

        const postData = {
          title: formData.title,
          content: formData.content,
          image: formData.image,
          tags: formData.tag, 
        }
        await onSubmit(postData)
        onCancel() // Call onCancel to reset the form
      } catch (err) {
        setError(err.message || "Failed to create post")
      } finally {
        setIsSubmitting(false)
      }
    }
  }


  const getTagTitle = (id) => {
    const found = tags.find(t => t._id === id);
    return found ? found.title : id;
  };

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPreview(false)} className="flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Edit
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Publish
          </button>
        </div>
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={formData.image || "/placeholder.svg?height=400&width=800"}
            alt={formData.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{formData.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-6">Bạn</span>
              <span>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>
            {formData.tag && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {getTagTitle(formData.tag)}
                </span>
              </div>
            )}
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="flex items-center text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreview(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!formData.content || !formData.title}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Publish
              </>
            )}
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Create New Post
        </h1>
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => handleInputChange("title", e.target.value)}
            placeholder="Enter post title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            required
          />
        </div>
        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Write your post content here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900"
            rows="15"
            required
          />
        </div>
        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ImageIcon className="h-4 w-4 inline mr-1" />
            Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => handleInputChange("image", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          />
        </div>
        {/* Tag */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Tag
          </label>
          <select
            value={formData.tag}
            onChange={handleTagChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            required
          >
            <option value="">Select tag...</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.title}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">Choose a relevant tag to help readers find your post</p>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog