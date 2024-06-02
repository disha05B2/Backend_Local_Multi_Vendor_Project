const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer=require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

const addFirm = async(req,res)=>{
    try {

        const {firmName,area,category}=req.body
        const image=req.file? req.file.filename:undefined;
        const vendor=await Vendor.findById(req.vendorId);
        if(!vendor){
            res.status(404).json({error:"Vendor Not Found"})
        }
        const firm=new Firm({
            firmName,
            area,
            category,
            image,
            vendor:vendor._id
    })
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm)

    await vendor.save()

    return res.status(200).json({message:'Firm Added Successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Internal Server Error'})
        
    }
}
const deleteFirmById = async(req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}