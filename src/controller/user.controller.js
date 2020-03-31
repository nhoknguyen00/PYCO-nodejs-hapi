import * as userService from '../service/user.service'

export const registerUser = async (request, h) => {
  console.log(request.payload)
  const { email, name, password } = request.payload
  return await userService.createUser(email, name, password)
}
