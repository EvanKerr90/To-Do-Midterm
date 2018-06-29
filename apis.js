let input = req.body.list;
const apiKey = 'zSL9-cuYDgOMp4YRJ9LjlwidFo8hTQ2P6fmXm6fAN3M8E7VVuyQT7mmE4HTlWks7nJ5X9h1mbluRPY9zMC_XI8S46YprxtQspNATurms73EN-OiUZ5UkH5cEnCk0W3Yx';
const client = yelp.client(apiKey);
const searchRequest = {
  term: input,
  location: 'Vancouver, BC'
};

client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0].name;
  //console.log(firstResult)
  const restaurantName = JSON.stringify(firstResult, null, 4);
  //console.log(restaurantName)
  database.insertPost(restaurantName, 'restaurant')
  res.render('index', {
    restaurant: restaurantName,
    other: null
  })
}).catch(error => {
  res.render('index', {
    restaurant: null,
    other: input
  })
  return;
})