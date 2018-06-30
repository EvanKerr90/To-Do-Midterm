$(document).ready(function () {
  loadPosts()

  function createPost(post) {
    var $post = $('<button>').attr('id', post.id).text(post.content).addClass("list-group-item")
    console.log($post)

    return $post;
  }


  function renderPosts(posts) {
    console.log(posts)
    posts.forEach(function(element)  {
      console.log(element)
      $('div.to eat').empty();
      var $post = createPost(element);
      $('div.to eat').append($post);
    })
  }


  function loadPosts() {
    $.ajax({
      Method: 'GET',
      url: '/posts',
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
