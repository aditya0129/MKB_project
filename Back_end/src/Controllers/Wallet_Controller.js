/* const userModel = require("../models/userModel");
const Wallet_Model = require("../models/Wallet_Model");

// const User_Wallet = async function (req, res) {
//   try {
//     const { wallet } = req.body;
//     const {User_id}=req.params;

//     let User=await userModel.find({User_id})
//     if(!User){
//         return res.status(404).json({status:false,MSG:"user not found"})
//     }
//     let Add_money=await userModel.updateMany({wallet},{new:true},{upsert:true});
//     return res.status(201).json({status:true,Data:Add_money,Msg:"successfully Add money in your wallet"})


//   } catch (error) {
//     return res.status(500).json({ status: false, msg: error.message });
//   }
// };

const User_Wallet = async function (req, res) {
    try {
      const { wallet } = req.body;
      const { User_id } = req.params;
  
      let User = await userModel.findOne({ _id:User_id});
      if (!User) {
        return res.status(404).json({ status: false, MSG: "User not found" });
      }
  
      let Add_money = await userModel.updateOne(
        { User_id },
        { $set: { wallet: wallet } },
        { new:true}
      );
  
      return res.status(201).json({
        status: true,
        Data: Add_money,
        Msg: "Successfully added money to your wallet"
      });
    } catch (error) {
      return res.status(500).json({ status: false, msg: error.message });
    }
  };
  
module.exports={User_Wallet}
 */


/* // Get user wallet balance
router.get('/wallet', async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ walletBalance: user.walletBalance });
});

// Add amount to wallet
router.post('/add-amount', async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user._id);
  user.walletBalance += amount;
  await user.save();
  const transaction = new Transaction({ userId: user._id, amount, type: 'credit' });
  await transaction.save();
  res.json({ success: true, message: 'Amount added to wallet' });
});

// Deduct amount from wallet
router.post('/deduct-amount', async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user._id);
  if (user.walletBalance >= amount) {
    user.walletBalance -= amount;
    await user.save();
    const transaction = new Transaction({ userId: user._id, amount, type: 'debit' });
    await transaction.save();
    res.json({ success: true, message: 'Amount deducted from wallet' });
  } else {
    res.json({ success: false, message: 'Insufficient balance' });
  }
}); */
