import FriendRequest from '../models/FriendRequest.model.js';
import User from '../models/User.model.js';

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, //exclude current users friends
        { isOnboarded: true }, //return only ones who are onboarded
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log('Error in getRecommendedUser controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('firends')
      .populate(
        'friends',
        'fullName profilePic nativeLanguage learningLanguage',
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.log('Error in getMyFriends controller', error);
    return res.sttaus(500).json({ message: 'Internal server error' });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    //prevent sending requests to your self
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: 'You cannot send request to yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: 'You are already friends with this user' });
    }

    //check i fa friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: 'A friend request already exist between you and this user',
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    return res.status(201).json({
      message: 'Friend request sent successfully',
      friendRequest,
    });
  } catch (error) {
    console.log('Error in sendFriendRequest controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to accept this request' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    //add eachother to friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.log('Error in acceptFriendRequest controller', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: 'pending',
    }).populate(
      'sender',
      'fullName profilePic nativeLanguage learningLanguage',
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: 'accepted',
    }).populate('sender', 'fullName profilePic');

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log('Error in getFriendRequests controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: 'pending',
    }).populate(
      'recipient',
      'fullName profilePic nativeLanguage leaningLanguage',
    );

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log('Error in getOutgoingRequests controller', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
