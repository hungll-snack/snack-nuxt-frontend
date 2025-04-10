import type { CommentState } from "./CommentType";

export const commentState = (): CommentState => ({
  comments: [],
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
});
