$(document).ready(function () {

  function createPost(post) {

    let $tweet = $('<article>').addClass('full tweet');
    var image = $('<img>').attr('src', tweet.user.avatars.small);
    var handle = $('<span>').text(tweet.user.handle).addClass('creator');
    var $name = $('<h2>').text(tweet.user.name);
    var $header = $('<header>');
    var createdDate = $('<span>').text(date).addClass('date created');
    var $iconSpan = $('<span>').addClass('icons');
    var icon1 = $('<i>').addClass('fab fa-font-awesome-flag');
    var icon2 = $('<i>').addClass('fas fa-retweet');
    var icon3 = $('<i>').addClass('fas fa-heart');
    var $footer = $('<footer>');
    var $content = $('<p>').text(tweet.content.text);
    $name.append(image, handle);
    $header.append($name);
    $iconSpan.append(icon1, icon2, icon3);
    $footer.append(createdDate, $iconSpan);
    $tweet.append($header, $content, $footer);


    return $post;
  }
  
function renderPosts(posts) {
  $('section.tweet').empty();
  posts.forEach(function (element) {
    var $post = createTweetElement(element);
    $('section.tweet').prepend($tweet);
  });
}


function loadPosts() {
  $.ajax({
    Method: 'GET',
    url: '/posts/',
    success: function (data) {
      renderPosts(data);
    }
  })
};

})
