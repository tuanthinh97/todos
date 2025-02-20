import apiClient from './apiClient'
import {postSchema} from "@/services/validationSchema.js";
import * as yup from "yup";

export const apiService = {
  // Hàm lấy dánh sách bài viết
  fetchPosts: async (size = 10, page = 1) => {
    try {
      const response = await apiClient.get(`/api/articles?sort=id,desc&size=${size}&page=${page-1}`)
      return {
        data: response.data,
        totalCount: parseInt(response.headers['x-total-count'], 10) || 0
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      return { data: [], totalCount: 0 }
    }
  },

  // Hàm lấy chi tiết bài viết
  fetchPostId: async (postId) => {
    try {
      const response = await apiClient.get(`/api/articles/${postId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  },

  // Hàm tạo bài viết mới
  createPost: async (postData) => {
    try {
      await postSchema.validate(JSON.parse(postData), { abortEarly: false });
      const response = await apiClient.post(`/api/articles`, postData);
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
      const response = await apiClient.put(`/api/articles/${postId}`, postData)
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
      return error
    }
  },

  // Hàm xóa bài viết
  deletePost: async (postId) => {
    try {
      await apiClient.delete(`/api/articles/${postId}`)
      console.log(`Post ${postId} deleted`)
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    }
  }
}
