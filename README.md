		<%- include("partials/header"); -%>

  <!-- Page Content -->
  <div class="container">

    <!-- Page Heading/Breadcrumbs -->
    <h1 class="mt-4 mb-3">Blog Home Two
      <small>Subheading</small>
    </h1>

    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <a href="index.html">Home</a>
      </li>
      <li class="breadcrumb-item active">Blog Home 2</li>
    </ol>

    <!-- Blog Post -->
    <!-- add to the initial form -->
    <div id="posts"> 
    <% posts.forEach(function(post){ %> 
     
     html += '<div class="card mb-4">';
       html += '<div class="card-body">';
         html += '<div class="row">';
          html += ' <div class="col-lg-6">';
            html += ' <a href="#">';
                html += ' <img class="img-fluid rounded" src="'+ formData.image +'" alt="">';
             html += '</a>';
           html += '</div>';
           html += '<div class="col-lg-6">';
             html += '<h2 class="card-title">formData.title</h2>';
             html += '<p class="card-text">formData.content</p>';
             html += '<a href="admin/posts/'+ formData._id +'" class="btn btn-primary">Read More &rarr;</a>';
          html += ' </div>';
        html += ' </div>';
       html += '</div>';
       html += '<% }); %>';
       html += '<div class="card-footer text-muted">';
         html += 'Posted on January 1, 2017 by';
        html += ' <a href="">Start Bootstrap</a>';
       html += '</div>';
     html += '</div>';
    
   
    //  Pagination
    // <ul class="pagination justify-content-center mb-4">
    //   <li class="page-item">
    //     <a class="page-link" href="#">&larr; Older</a>
    //   </li>
    //   <li class="page-item disabled">
    //     <a class="page-link" href="#">Newer &rarr;</a>
    //   </li>
    // </ul> 

   html += '</div>';
   html += ' ';
   $("#posts").prepend(html);
});
  
  
  </script>



		<%- include("partials/footer"); -%>

