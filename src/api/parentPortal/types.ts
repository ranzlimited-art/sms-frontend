export interface Branch {
  id: number;
  name: string;
}

export interface SchoolType {
  id: number;
  type: string;
  display_name: string | null;
}

export interface SchoolClass {
  id: number;
  name: string;
}

export interface Enrollment {
  id: number;
  status: string;
  school_class?: SchoolClass;
}

export interface ChildStudent {
  id: number;
  uuid: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  status: string;
  photo_url: string | null;
  branch?: Branch;
  school_type?: SchoolType;
  enrollments?: Enrollment[];
}

export interface ParentDashboardApiResponse {
  data: ChildStudent[];
}