export class User {
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  role: string = '';
  email: string = '';
  job_description: string = '';
  company_name: string = '';
  // isAdmin:boolean=false;

  public static userList: Array<User> = [];
  getCompanyName() {
    return this.company_name;
  }
}
