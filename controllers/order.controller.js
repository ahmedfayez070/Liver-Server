import Stripe from "stripe";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "aed",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });
  await newOrder.save();

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } }
    );
    return res.status(200).json("Order has been confirmed");
  } catch (error) {
    next(error);
  }
};

// export const addOrder = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);

//     const newOrder = new Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       buyerId: req.userId,
//       sellerId: gig.userId,
//       price: gig.price,
//       payment_intent: "temporary",
//     });
//     await newOrder.save();
//     return res.status(200).json("success");
//   } catch (error) {
//     next(error);
//   }
// };

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
