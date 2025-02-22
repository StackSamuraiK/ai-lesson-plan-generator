export interface User {
    email: string;
    password: string;
  }
  
  export interface LessonPlan {
    topic: string;
    gradeLevel: string;
    mainConcept: string;
    materials: string;
    objectives: string;
    outline: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
  }