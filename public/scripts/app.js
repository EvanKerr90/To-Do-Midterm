$(document).ready(function () {
  loadPosts()

  function createPostElement(post) {
    //console.log(post.content)
    var $image = $('<i>').addClass("fa fa-trash")
    var $span = $('<span>').addClass('span')
    var $post = $('<button>').attr('draggable', 'true').attr('ondragstart', 'drag(event)').attr('type', 'button').attr('id', post.id).text(post.content)
    var $div = $('<div>').addClass('list-group')

    $span.append($image)
    $post.append($span)
    $div.append($post)
    //console.log($div)

    return $div;
  }


  function renderPosts(posts) {
    //console.log(posts)
    $('div.card-body').empty()
    posts.forEach(function(element)  {
      let category = element.category
      //console.log(category)
      var $post = createPostElement(element);
      console.log($('div#' + category + '.card-body'))
      $('div#' + category + '.card-body' ).append($post);
    });
  }


  function loadPosts() {
    $.ajax({
      Method: 'GET',
      url: '/posts',
      success: function (data) {
        //console.log(data)
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
