class UserDto {
    constructor(user) {
      this.id = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.age = user.age;
      this.email = user.email;
      this.role = user.role;
    }
  }
  
  export default UserDto;