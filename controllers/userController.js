const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
    try {
        // console.log(req.user)
        const user = await User.findById(req.user.id).select('-password -_id');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
