import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/APIerror.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinaryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

//user registration
const registerUser = asyncHandler(async (req, res) => {
  //get user field
  const { fullname, email, username, password } = req.body;

  //validation

  /*
  if (fullname === '') {
    throw new ApiError(400,"full name is required");
  }
  */

  if (
    [fullname, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All field are required');
  }

  //user already exist??
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log('esisted user is:', existedUser);
  if (existedUser) {
    throw ApiError(409, 'User with email or username aalready exist');
  }
  //check images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);

  const coverImageLocalPath = req.files?.avatar[0]?.path;
  console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avater File is required');
  }

  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, 'Avater File is required');
  }

  //make an object

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.lowercase,
  });
  const userCreated = await user
    .findId(user._id)
    .select('-password -refrehToken');
  if (!userCreated) {
    throw new ApiError(400, 'Error occured while registration');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, 'User registered successfully'));
});

//user login
const loginUser = asyncHandler(async (req, res) => {
  //get data from user
  const { email, username, password } = req.body;

  //user or email id required
  if (!username || !email) {
    throw new ApiError(400, 'username or email is required');
  }

  //find user from database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, 'user does not exist');
  }

  //check user password
  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, 'Invalid password');
  }

  //assign access and refresh token
  const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);

      //generate access and refresh token
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      //add to database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        'Something went wrong while generating referesh and access token'
      );
    }
  };

  await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  //send cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

export { registerUser, loginUser };
