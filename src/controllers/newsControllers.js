const connection = require("../DB/connection");
const newsModel = require("../Model/newsSchema");

const allNews
 = async (req, res) => {
  try{
   await  req.user.populate('news')
   res.status(201).send(req.user.news)
  }
  catch(e){
    res.status(500).send(e.message)
  }
};

const addnews = async (req, res) => {
  try{
    const news = new newsModel({...req.body,publisher:req.user._id})
    await news.save();
    res.status(200).send(news);
  }catch(err){
    res.status(400).send(err.message)
  }
}


const getById = async (req, res) => {
  try {

    const _id = req.params.newsId;
    const news = await newsModel.findOne({ _id, publisher: req.user._id });
    if (!news) {
      return res.status(404).send("Not founeded");
    }
    res.status(200).send(news);
  } catch (err){
    res.status(400).json({ message: "error", err: err.message });
  }
};


const updateNews = async (req, res) => {
  const allow = ["description", "complete"];
  const fields = Object.keys(req.body);
  const valid = fields.every((field) => allow.includes(field));

  if (valid) {
    try {
      const id = req.params.newsId;

      const news = await newsModule.findById(id);

      if (!news) {
        return res.status(400).send("No news founeded");
      }
      fields.forEach((element) => (news[element] = req.body[element]));
      //accessing object value by brackets cause I'm not sure that the key is exist
      await news.save();
      res.status(200).send(taconfigration);
    }
   catch {
    const notAllowed = fields.filter((field) => !allow.includes(field));
    res.status(400).send(`you can't ediet ${notAllowed} field`);
  }
};
}


const deleteNews = (req, res) => {
  newsModel
    .findByIdAndDelete(req.params.newsID)
    .then((data) => {
      if (data) {
        res.send(`news with id: ${req.params.newsID} has been deleted`);
      } else {
        res.status(400).send(`news id: ${req.params._id} Not Found`);
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
};

module.exports = { allNews,
   addnews, getById, updateNews, deleteNews };