export interface BoardModify {
    id: number;         
    readonly user_id: string; //수정 불가능
    title: string;      
    content: string;    
    image?: string;     
    end_time: string;  
  }
  