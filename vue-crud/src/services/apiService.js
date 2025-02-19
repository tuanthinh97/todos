import apiClient from './apiClient'
import {postSchema} from "@/services/validationSchema.js";
import * as yup from "yup";

export const apiService = {
  // Hàm lấy dánh sách bài viết
  fetchPosts: async (limit = 10, page = 1) => {
    try {
      const skip = (page - 1) * limit
      const response = await apiClient.get(`posts?limit=${limit}&skip=${skip}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  },

  // Hàm lấy chi tiết bài viết
  fetchPostId: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  },

  // Hàm tạo bài viết mới
  createPost: async (postData) => {
    try {
      const errors = await postSchema.validate(JSON.parse(postData), { abortEarly: false });
      console.log(errors);
      const response = await apiClient.post(`/posts/add`, postData);
      console.log('Post Created:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {}
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })
        console.log(validationErrors) // Lỗi sẽ được gom theo từng field
        return {error: validationErrors};
      }
      console.error('Error creating post:', error);
      return error;
    }
  },

  // Hàm cập nhật bài viết
  updatePost: async (postId, postData) => {
    try {
      await postSchema.validate(postData, { abortEarly: false });
      const response = await apiClient.put(`/posts/${postId}`, postData)
      console.log('Post Updated:', response.data)
      return response.data
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {}
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message
        })
        console.log(validationErrors) // Lỗi sẽ được gom theo từng field
        return {error: validationErrors};
      }
      console.error('Error updating post:', error)
      return null
    }
  },

  // Hàm xóa bài viết
  deletePost: async (postId) => {
    try {
      await apiClient.delete(`/posts/${postId}`)
      console.log(`Post ${postId} deleted`)
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }
}
