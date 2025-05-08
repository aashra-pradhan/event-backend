const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  mobileNum: {
    type: String,
    required: [true, "Mobile number is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  products: [
    {
      userId: {
        type: String,
        required: [true, "Product Seller's Id is required"],
      },
      username: {
        type: String,
        required: [true, "Username is required"],
      },
      numOfRatings: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
      },

      reviews: {
        type: [
          {
            reviewedBy: mongoose.Schema.Types.ObjectId,
            message: String,
          },
        ],
      },
      name: {
        type: String,
        required: [true, "Product name  is required"],
      },
      shortDescription: {
        type: String,
        required: [true, "Short description  is required"],
      },
      description: {
        type: String,
        required: [true, "Product description is required"],
      },
      requirements: {
        type: String,
        required: [true, "Event requirements is required"],
      },
      viewCount: {
        type: Number,
        default: 0,
      },
      category: {
        id: String,
        category: String,
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity  is required"],
      },
      // price: {
      //   type: Number,
      //   required: [true, "Product price is required"],
      // },
      productImages: [],
      location: String,
      date: Date,
      time: String,
      isPrivate: Boolean,
      marketing: Boolean,
      ticketPrice: {
        type: Number,
        required: false, // or just omit this line
      },
      // maxAttendees: Number,
      // coverImage: {
      //   id: String,
      //   name: String,
      // },
      eventStatus: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      totalTicketsSold: {
        type: Number,
        default: 0,
      },
    },
  ],
  purchasedProducts: [],
  isVerified: {
    type: Boolean,
    default: true,
  },
  requirePasswordChange: {
    type: Boolean,
    default: false,
  },
});

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
