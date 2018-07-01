$(document).ready(function () {
  loadPosts()

  function createPostElement(post) {
    //console.log(post.content)
    var $image = $('<button>').addClass("fa fa-trash").attr('id', 'icon').click(function(event){
      $(this).parent().parent().fadeOut(500, function(){
        $(this).remove();
      })
      $.ajax({
        type: 'POST',
        url: '/posts/delete',
        data: {id: $(this).parent().parent().attr('id')}
      })
      event.stopPropagation();
    })
    var $span = $('<span>').addClass('span')
    var $post = $('<button>').attr('draggable', 'true').attr('ondragstart', 'drag(event)').attr('type', 'button').attr('id', post.id).text(post.content)
    var $div = $('<div>').addClass('list-group').attr('id', post.id).click(function(){

      if($(this).css("color") === "rgb(128, 128, 128)"){
         $(this).css({
          color: "black",
          textDecoration: "none"
   
        });
      }
      else{
        $(this).css({
          color: "gray",
          textDecoration: "line-through"
   
        });
   
      }
   
      });

    $span.append($image)
    $post.append($span)
    $div.append($post)

    return $div;
  }




  function renderPosts(posts) {
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

  $("button").click(function(){

    if($(this).css("color") === "rgb(128, 128, 128)"){
       $(this).css({
        color: "black",
        textDecoration: "none"
 
      });
    }
    else{
      $(this).css({
        color: "gray",
        textDecoration: "line-through"
 
      });
 
    }
 
    });


})
