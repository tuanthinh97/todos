import * as yup from 'yup'

// Schema kiểm tra dữ liệu bài viết
export const postSchema = yup.object({
  title: yup
    .string()
    .trim()
    // .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    // .max(255, 'Tiêu đề không được vượt quá 255 ký tự')
    .required('Tiêu đề là bắt buộc'),

  body: yup
    .string()
    .trim()
    .min(10, 'Nội dung phải có ít nhất 10 ký tự')
    .max(500, 'Nội dung không được vượt quá 500 ký tự')
    .required('Nội dung là bắt buộc')
})
