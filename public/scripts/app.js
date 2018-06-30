$(document).ready(function () {
  loadPosts()

  function createPost(post) {
    var $post = $('<button>').attr('id', post.id).text(post.content).addClass("list-group-item")

    return $post;
  }


  function renderPosts(posts) {
    console.log(posts)
    posts.forEach(function(element)  {
      $('div.to-eat' + element.category).empty();
      var $post = createPost(element);
      $('div.to eat' + element.category).append($post);
    })
  }


  function loadPosts() {
    $.ajax({
      Method: 'GET',
      url: '/posts/',
      success: function (data) {
        console.log(data)
        renderPosts(data);
      }
    })
  };

  $('form').on('submit', function (post) {
    post.preventDefault();
    //var data = $('form').val()
    //console.log(data)
    var message = $('form textarea').val();
    //console.log(message)
    if (message.length <= 0) {
      alert("Please write some text.")
      return;
    } else {
      $.post('/posts', {data:message}, function () {
        $('form textarea').val('')
        return loadPosts() ;
      }) 
    }
  });

})
