async function createProblem(req, res) {
  return res.status(200).json({
    message: "Create Problem API working"
});
}

module.exports = {createProblem};
