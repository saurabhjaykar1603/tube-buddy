import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "./../models/user.model.js";
import { uploadOnCloudNary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exits : username , email
  // check fir image, check for avtar
  // upload them to cloudinary , avtar
  // create user objet - create entry in db
  // remove password  and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const existedUser = User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits");
  }

  const avatarlocalPath = req.files?.avatar[0]?.path;
  const coverImagelocalPath = req.files?.coverImage[0]?.path;
  if (!avatarlocalPath) {
    throw new ApiError(400, "avatar image is compulsory");
  }
  const avatar = await uploadOnCloudNary(avatarlocalPath);
  const coverImage = await uploadOnCloudNary(coverImagelocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is requied");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
  });
  const createdUser = User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registered the user");
  }
});

return res
  .status(201)
  .json(new ApiResponse(200, createdUser, "user created successfully"));

export { registerUser };
