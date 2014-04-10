var Articles = require('./articles.js');
var User = require('./user.js');

module.exports = function(app,passport){
    app.get('/',function(req,res){
        if (req.isAuthenticated()){
            //console.log("authenticated");
            res.redirect('/articles');
        }
        res.render('home.ejs',{
            message: req.flash('loginMessage'),
            signupMessage : req.flash('signupMessage')
        });
    });

    app.get('/partials/*', function(req, res) {
       res.render('../views/partials/' + req.params);
       //res.send(req.params);
    });

    app.get('/articles',isLoggedIn,function(req,res){
       res.render('../views/articles.ejs',{
           user:req.user.local.email
       });
    });

    app.post('/api/update/userPost',isLoggedIn,function(req,res){

        User.update({'local.email':req.user.local.email},{
            $pull : {'userArticles':{'_id':req.body._id}}
        },function(err,numAffected){
            console.log('---numaffected----'+numAffected);
            if(err)
                res.send(err);
        });
        User.update(
            { 'local.email': req.user.local.email },
            { $push: {
                'userArticles':req.body
            }}, function (err, numAffected) {
            console.log(numAffected);
            }
        );
        res.send('done');
    });

    app.get('/api/latest-articles',function(req,res){
        //send latest 5 articles
        var q = Articles.find({},{'description':false,'_id':false}).limit(8).sort({'date':-1});
        q.exec(function(err, lPosts) {
            if(err)
                res.send(err);
            res.json(lPosts);
        });
    });

    app.get('/api/posts',function(req,res){
        //send latest 5 articles
        var q = Articles.find({},{'description':false}).limit(140).sort({'date':-1});
        q.exec(function(err, lPosts) {
            if(err)
                res.send(err);
            res.json(lPosts);
        });
    });

    app.get('/api/getpost/:postid',function(req,res){
        User.find({"userArticles._id":req.params.postid},{"userArticles.$":1},function(err,article){
            if(err)
                console.log("Error Occured "+err);
            if(article.length>0){
                res.json(article[0].userArticles);
            }else{
                Articles.find({_id:req.params.postid},function(err,data){
                    if(err)
                        console.log('ERROR '+err);
                    res.json(data);
                });
            }
        });
    });

    app.get('/api/testme',function(req,res){
        var a = User.find({'local.email':'root2@root.com'},
        function(err,user){
            if(user.length>0){
                console.log(user);
                res.send('Found the user');
            }else{
                res.send('Couldnt find the user');
            }
        });
    });

    app.get('/api/test',function(req,res){
        User.find({},function(err,ar){
           console.log('Number of Articles ---> '+ar);
        });
        User.find({"userArticles._id":'5342b8c8f92d7abe42fbf5d8'},{"userArticles.$":1},function(err,article){
           if(err)
           console.log("Error Occured "+err);
           if(article.length>0){
            res.json(article);
           }else{
               Articles.find({_id:'5342b8c8f92d7abe42fbf5d8'},function(err,data){
                   if(err)
                       res.send(err);
                   res.json(data);
               });
           }
        });
    });

    app.post('/', passport.authenticate('local-login', {
        successRedirect: '/articles', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/articles', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*',function(req,res){
        res.redirect('/');
    });



    //route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        //if user is authenticated in the session then carry on
        if (req.isAuthenticated())
            return next();

        //if they aren't redirect them to the home page
        res.redirect('/');
    }
}