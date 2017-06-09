var organizationalModel      = require('../models/organizations.js');
var siteName = 'Heavy-lifting'
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
////////////////////////////////////////////
/////  GO TO PAGE NEW ORGANIZATION    ///// 
//////////////////////////////////////////
exports.neworg = function(req, res) {
    //Perform Routing for Varios user type on the home page.
    if (req.user) {
    	res.render('neworg',{
        title: 'New Organization | Heavy-lifting' ,
      })
    } else {
        res.redirect('/signin');
    }
}; 

///////////////////////////////////////////////
///////   CREATE ORGaNIZATION STATIC  ////////
/////////////////////////////////////////////
exports.createorgstatic = function(req, res) {
    //console.log('//////////////////////////////////////////')
   //console.log('//////  CREATE NEW ORGaNIZATION  ////////')
   // console.log('////////////////////////////////////////')
//Allow for new credit cards every time , Do not call old CC details.	
if (req.user) {
    req.assert('name', 'Username cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
    var errors = req.validationErrors();
    if (errors) {
       req.flash('error', errors);
       return res.redirect('/organization/new');
   }
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.body.name }, function(err, username) {
    	if (username) {
    		req.flash('error', { msg: 'The Organizational name you have entered is already associated with another account.' });
    		return res.redirect('/organization/new');
    	}
        var temp = {}
        temp['entry'] ={
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          owner : req.user.username,
          members : ''
      }        
      user = new organizationalModel(temp);
      user.save(function(err) {
          req.logIn(user, function(err) {
             res.redirect('/organizations/'+req.body.name);
         });
      });
  });
} else {
   res.redirect('/signin');
}
}

////////////////////////////////////////////
////////// PROFILE ORGANIATION ////////////
//////////////////////////////////////////
exports.orgprofile = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('account/orgprofile',{
                organization : username,
                organizations : req.userorgs ,
                title: username.entry.name + ' | Heavy-lifting' ,
            }
            )
        } else {
            return res.redirect('/');
        }
    })
}

////////////////////////////////////////////
////////// PROFILE ORGANIATION ////////////
//////////////////////////////////////////
exports.orguserread = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('account/orgprofile',{
                organization : username,
                organizations : req.userorgs ,
                title: username.entry.name + ' | Heavy-lifting' ,
            }
            )
        } else {
            return res.redirect('/');
        }
    })
}

////////////////////////////////////////////
////////// PROFILE ORGANIATION ////////////
//////////////////////////////////////////
exports.ajaxorguserread = function(req, res, next) {
  if (req.user) {
    //console.log(req.user)
      var username =  req.user.username
      var query1 = organizationalModel.find(
        {$or: [
          {"entry.members": username },
          {"entry.owner":  username }
          ]}
        )
      query1.exec(function (err, query1_return) {
      if(err){console.log('Error Here'); return;} 
        req.userorgs = query1_return
        next();
    })
} else {
 next();
}
}

//////////////////////////////
//////////  PAGE ////////////
////////////////////////////
exports.page = function(req, res) {
   var template =  req.params.page 
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/'+template,{
                organization : username,
                organizations : req.userorgs ,
                title: 'Settings | '+username.entry.name   ,

            }
            )
        } else {
            return res.redirect('/');
        }
    })
};


 ////////////////////////////////////
////////// SETTINGS PAGE ///////////
///////////////////////////////////
exports.settings = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/settings',{
                organization : username,
                organizations : req.userorgs ,
                title: 'Settings | '+username.entry.name   ,
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};

 //////////////////////////////////////
////////// COMPONENTS PAGE ///////////
/////////////////////////////////////
exports.components = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
      if (username) {
        var ids = '58d371b01373c63dccdee169'
        var Formids = '58aa74140b9d3241280ecf17'
        res.render('orgsettings/components', {
          siteName : siteName,
          items : JSON.stringify(ids),
          Formids : JSON.stringify(Formids),
          organization : username,
          organizations : req.userorgs ,
          title: 'Components | '+username.entry.name   ,
        });
      } else {
        return res.redirect('/');
      }
    })
  };


////////////////////////////////////
////////// ASSEMBLIES PAGE ////////
//////////////////////////////////
exports.assemblies = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/assemblies',{
                organization : username,
                organizations : req.userorgs ,
                title: 'Assemblies | '+username.entry.name   ,
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};


///////////////////////////////////
////////// PEOPLE PAGE ///////////
/////////////////////////////////
exports.people = function(req, res) {
    //check the user name for duplicate.
    organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, username) {
        if (username) {
            res.render('orgsettings/people',{
                organization : username,
                organizations : req.userorgs ,
                title: 'People | '+username.entry.name   ,
            }
            )
        } else {
            return res.redirect('/');
        }
    })
};

///////////////////////////////////
////////// ORGPUT PAGE ///////////
/////////////////////////////////
exports.orgPut = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  var errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors);
    res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
  }
  organizationalModel.findOne({ 'entry.name': req.params.orgname }, function(err, organizationItem) {
    organizationalModel.findById(organizationItem._id, function (err, orgid) {
      if (err) return handleError(err);
      if (orgid) { 
//Profile Picture saving.
var image = req.body.croppedImg
var fs = require('fs');
var directory = 'public/uploads/'
var fileName = directory+orgid._id+'.jpg'
var data = image.replace(/^data:image\/\w+;base64,/, '');
fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
  //Finished
});
        //Painful parse issue.
        var temp = JSON.parse(JSON.stringify(orgid.entry))
        temp.picture = '/uploads/'+orgid._id+'.jpg'
        //Assign
        

if (req.body.name !=null) {
   temp.name = req.body.name
}
       

temp.displayname = req.body.displayname
        temp.description = req.body.description
        temp.location = req.body.location
        temp.url = req.body.url
        temp.email = req.body.email
        orgid.entry = temp    
        orgid.save(function(err,doc) {
          req.flash('success', { msg: 'Your profile information has been updated.' });
          res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
        });
      } else {
        req.flash('error', { msg: 'Something went wrong here.' });
        res.redirect('/organizations/'+req.params.orgname+'/settings/profile');
      }
    });
  })
};


///////////////////////////////////////////
//////////  ORGaNIZATION LIST ////////////
/////////////////////////////////////////
exports.orglist = function(req, res) {
  if (req.user) {
    if (req.user.permission=="superadmin") {
      organizationalModel.find(  function(err, username) {
        res.render('orginizationlist',{
          username : username,
          title: 'Organizations | Heavy-lifting'   ,
        });
      });
    } else {
     res.redirect('/signin');
   }  
 } else {
   res.redirect('/signin');
 }
};