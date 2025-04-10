export interface Comment {
    comment_id: number;
    content: string;
    author_nickname: string;
    created_at: string;
    is_deleted?: boolean;
    is_author?: boolean;
  }
  
  export interface CommentState {
    comments: Comment[];
    isLoading: boolean;
    isSuccess: boolean;
    errorMessage: string | null;
  }