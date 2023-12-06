const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const app = express();
var session = require("express-session");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


app.set('view engine', 'ejs');
app.use("/public",express.static("public"));
app.use(session({ secret: "Key", cookie: { maxAge: 600000 } }));
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "event"
});

connection.connect(function(error){
    if(error) throw error
    else console.log("connected to the database successfully!")
})

//multer

const addTimestamp = function (req, res, next) {
    req.timestamp = Date.now();
    next();
};

// Function to determine the destination folder dynamically
const getDestination = function (req, file, cb) {
    let destinationFolder;

    // Check the route or any other condition to determine the destination folder
    if (req.originalUrl.includes('venue')) {
        destinationFolder = 'venue/images/';
    } else if (req.originalUrl.includes('decor')) {
        destinationFolder = 'decor/images/';
    } else if (req.originalUrl.includes('staff')) {
        destinationFolder = 'staff/images/';
    } else if(req.originalUrl.includes('cuisine')) {
        destinationFolder = 'catering/cuisine/images/';
    }else{
        destinationFolder = 'user/images/';

    }



    // Construct the absolute path
    const absolutePath = path.join(__dirname, 'public', destinationFolder);

    cb(null, absolutePath);
};

const storage = multer.diskStorage({
    destination: getDestination,
    filename: function (req, file, cb) {
        // Use the original filename without any modifications
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const verifySignedIn = (req, res, next) => {
    if (req.session.signedIn) {
      next();
    } else {
      res.redirect("/login");
    }
  };

//routes for pages

//route for the main page
app.get("/",function(req,res){
    res.render('user/index');
})
//route for the login page
app.get("/login",function(req,res){
    if (req.session.signedIn) {
        res.redirect("/userhome",{});
      } else {
        res.render("user/login", {
          admin: false,
          signInErr: req.session.signInErr,
        });
        req.session.signInErr = null;
      }
})

app.get("/signout", function (req, res) {
    console.log(req.session.user,"llll")
    req.session.signedIn = false;
    req.session.user = null;
    res.redirect("/");
  });
//route for the registration page
app.get("/registration",function(req,res){
    res.render('user/registration');
})
//route for the contact page
app.get("/contact",function(req,res){
    res.render('user/contact');
})
//route for the userhome page
app.get("/userhome",function(req,res){
      let signedIn= req.session.signedIn;
      let user= req.session.user
    res.render('user/user-home',{user,signedIn});
})
//route for the service page
app.get("/service",function(req,res){
    res.render('user/service');
})


// Route for the admin login page
app.get("/admin",function(req, res) {
    if (req.session.signedIn) {
        res.redirect("/admin/dashboard",{isAdmin:true});
      } else {
        res.render("admin/admin-login", {
            isAdmin: true,
          signInErr: req.session.signInErr,
        });
        req.session.signInErr = null;
      }
})
app.get("/admin/login", function(req, res) {
    if (req.session.signedIn) {
        res.redirect("/admin/dashboard",{isAdmin:true});
      } else {
        res.render("admin/admin-login", {
            isAdmin: true,
          signInErr: req.session.signInErr,
        });
        req.session.signInErr = null;
      }
})

app.get("/admin/signout", function (req, res) {
    req.session.signedIn = false;
    req.session.admin = null;
    res.redirect("/admin/login");
  });
//route for the admin dashboard page
app.get('/admin/dashboard', async(req, res) => {
 await connection.query("SELECT * FROM booking",function(error,result,fields){
    if (result.length > 0){
        let bookings = result; 
        res.render('admin/admin-dashboard', { bookings });
    }else{
        let bookings = result; 
        res.render('admin/admin-dashboard', { bookings:0 });
    }
})
   
});
//route for the admin booking page
app.get("/admin/booking",async function(req,res){
    await connection.query("SELECT * FROM booking where status='requsted' ",function(error,result,fields){
        if (result.length > 0){
            let bookings = result; 
            res.render('admin/admin-booking', { bookings });
        }else{
            let bookings = result; 
            res.render('admin/admin-booking', { bookings:0 });
        }
    })
})

app.get("/admin/change-status/:bid/:status",async function(req,res){
    let bid=req.params.bid;
    let status="accepted";
    await connection.query("UPDATE booking SET status = ? where booking_id=?",[status,bid],function(error,result,fields){
        if (error) {
            console.log("Error inserting data into the database:", error);
            res.redirect("/admin/booking"); // Redirect back to registration page on error
        } else {
            console.log("status updatedsuccessful!");
            res.redirect("/admin/booking"); // Redirect to the home page or another page on successful registration
        }
    })}
)

app.get("/user/delete-status/:bid",async function(req,res){
    let bid=req.params.bid;
    try {
        await connection.query("DELETE FROM booking WHERE  booking_id = ?", [bid]);

        res.redirect("/user/bookings");
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.redirect("/user/bookings");
    }
})

app.get("/admin/delete-status/:bid",async function(req,res){
    let bid=req.params.bid;
    try {
        await connection.query("DELETE FROM booking WHERE  booking_id = ?", [bid]);

        res.redirect("/admin/booking");
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.redirect("/admin/booking");
    }
})


//route for the admin staff page
app.get("/admin/staff", async function (req, res) {
        let staff = await connection.query("SELECT * FROM staff",function(error,result,fields){
            if (result.length > 0){
                let staff = result; 
                console.log(staff)
                res.render('admin/admin-staff', { staff });
            }else{
                let staff = result; 
                res.render('admin/admin-staff', { staff });
            }
        })
    }
);

app.get("/admin/edit-staff", async function (req, res) {
    try {
        let id=req.query.id;
        let staff = await connection.query("SELECT * FROM staff WHERE staff_id = ?",[id],function(error,result){
            if (result.length > 0){
                let staff = result; 
                res.render('admin/edit-staff', { staff });
            }else{
                res.render('admin/edit-staff', { staff });
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});

app.post('/admin/add-staff', encoder, function (req, res) {
    var name = req.body.staffname;
    var dob = req.body.staffdob;
    var phone = req.body.staffphone;
    var address = req.body.staffaddress;
    var username = req.body.staffusername;
    var password = req.body.staffpass;


    // Insert data into the database
    connection.query(
        "INSERT INTO staff (staff_name, dob, staff_phone, staff_address, staff_username, staff_password) VALUES (?, ?, ?, ?, ?, ?)", [name, dob ,phone, address, username, password], function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/admin/staff"); // Redirect back to registration page on error
            } else {
                console.log("Registration successful!");
                res.redirect("/admin/staff"); // Redirect to the home page or another page on successful registration
            }
            res.end();
        }
    );
});
app.post('/admin/edit-staff/:id', function (req, res) {
    var staffId = req.params.id;
    var name = req.body.staffname;
    var dob = req.body.staffdob;
    var phone = req.body.staffphone;
    var address = req.body.staffaddress;
    var username = req.body.staffusername;
    var password = req.body.staffpass;
 
    // Update data in the database
    connection.query(
        "UPDATE staff SET staff_name = ?, dob = ?, staff_phone = ?, staff_address = ?, staff_username = ?, staff_password = ? WHERE staff_id = ?", 
        [name, dob, phone, address, username, password, staffId], 
        function (error, result, fields) {
            if (error) {
                console.log("Error updating staff data in the database:", error);
                res.status(500).send("Internal Server Error");
            } else {
                console.log("Update successful!");
                res.redirect("/admin/staff"); // Redirect to the staff listing page after successful update
            }
        }
    );
});


app.get("/admin/delete-staff", async function(req, res) {
    const staffId = req.query.id;
    try {
        await connection.query("DELETE FROM staff WHERE staff_id = ?", [staffId]);

        res.redirect("/admin/staff");
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.redirect("/admin/staff");
    }
});

//route for the admin catering page
app.get("/admin/catering", async function (req, res) {
    try {
        let catering = await connection.query("SELECT * FROM catering",function(error,result,fields){
            if (result.length > 0){
                let catering = result; 
                res.render('admin/admin-catering',{catering});
            }
        })
    }catch (error) {
        
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});

app.post('/admin/add-catering', encoder, function (req, res) {
    var name = req.body.name;
    var location = req.body.location;
    var desc = req.body.desc;
    var username = req.body.username;
    var password = req.body.password;

    // Insert data into the database
    connection.query(
        "INSERT INTO catering (catering_name, catering_location, catering_desc, catering_username, catering_password) VALUES (?, ?, ?, ?, ?)",
        [name, location, desc, username, password], function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/admincatering"); // Redirect back to registration page on error
            } else {
                console.log("Successful!");
                res.redirect("/admin/catering"); // Redirect to the home page or another page on successful registration
            }
            res.end();
        }
    );
});

app.get("/admin/edit-catering", async function (req, res) {
    try {
        let id=req.query.id;
        let catering = await connection.query("SELECT * FROM catering WHERE catering_id = ?",[id],function(error,result){
            if (result.length > 0){
                let catering = result; 
                res.render('admin/edit-catering', { catering });
            }else{
                res.render('admin/edit-catering', { catering });
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});


app.post('/admin/edit-catering/:id', encoder, function (req, res) {
    var Id = req.params.id;
    var name = req.body.name;
    var location = req.body.location;
    var desc = req.body.desc;
    var username = req.body.username;
    var password = req.body.password;

    // Insert data into the database
    connection.query(
        "UPDATE catering SET catering_name=?, catering_location =?, catering_desc=?, catering_username=?, catering_password=? WHERE catering_id =?",
        [name, location, desc, username, password,Id], function (error, result, fields) {
            if (error) {
                console.log("Error updating staff data in the database:", error);
                res.status(500).send("Internal Server Error");
            } else {
                console.log("Successful!");
                res.redirect("/admin/catering"); // Redirect to the home page or another page on successful registration
            }
        }
    );
});
 //delete
app.get("/admin/delete-catering", async function(req, res) {
    const Id = req.query.id;
    try {
        await connection.query("DELETE FROM catering WHERE catering_id = ?", [Id]);

        res.redirect("/admin/catering");
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.redirect("/admin/catering");
    }
});

//venue management
//route for the admin venue page
app.get("/admin/venue",async function(req,res){
try {
    let venue = await connection.query("SELECT * FROM venue",function(error,result,fields){
        if (result.length > 0){
            let venue = result; 
            res.render('admin/admin-venue',{venue});
        }else{
            res.render('admin/admin-venue',{venue:0});
        }
    })
}catch (error) {
    
    
    console.error("Error executing SQL query:", error);
    // Handle the error appropriately, e.g., render an error page
    res.status(500).send("Internal Server Error");
}
})

app.post('/admin/edit-venue/:id',function (req, res) {
  
    var name = req.body.name;
    var id=req.params.id;
    var category = req.body.category;
    var amount = req.body.amount;
    var capacity = req.body.capacity;
    var location = req.body.location;
    var image = "img";
    var desc = req.body.desc;

    connection.query(
        "UPDATE  venue SET venue_name=?, venue_category=?, venue_amount=?, venue_capacity=?, venue_location=?, venue_desc=? WHERE venue_id =?",
        [name, category, amount, capacity, location, desc,id],
        function (error, result, fields) {
            if (error) {
                console.log("Error editing data into the database:", error);
                res.redirect("/admin/venue"); // Redirect back to registration page on error
            } else {
                console.log("updated!!! the database:", error);
                res.redirect("/admin/venue")
               // fs.renameSync('public/venue/images/' + req.file.filename, 'public/venue/images/' + filename);

                // Update the database with the generated filename
               
            }
        }
    );
});
app.post('/admin/add-venue', upload.single('file'), encoder, function (req, res) {
    const uploadedFile = req.file;
    var name = req.body.name;
    var category = req.body.category;
    var amount = req.body.amount;
    var capacity = req.body.capacity;
    var location = req.body.location;
    var image = "img";
    var desc = req.body.desc;

    connection.query(
        "INSERT INTO venue (venue_name, venue_category, venue_amount, venue_capacity, venue_location, venue_desc) VALUES (?, ?, ?, ?, ?, ?)",
        [name, category, amount, capacity, location, desc],
        function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/admin/venue"); // Redirect back to registration page on error
            } else {
                // Get the inserted ID
                const insertedId = result.insertId;

                // Use the inserted ID to generate the filename
                const filename = insertedId + '.png';

                // Move the uploaded file to the final destination with the new filename
                fs.renameSync('public/venue/images/' + req.file.filename, 'public/venue/images/' + filename);

                // Update the database with the generated filename
                connection.query(
                    "UPDATE venue SET venue_image = ? WHERE venue_id = ?",
                    [filename, insertedId],
                    function (updateError, updateResult, updateFields) {
                        if (updateError) {
                            console.log("Error updating database with filename:", updateError);
                        } else {
                            console.log("Database updated with filename:", filename);
                        }
                        res.redirect("/admin/venue"); // Redirect to the home page or another page on successful registration
                        res.end();
                    }
                );
            }
        }
    );
});
app.get("/admin/edit-venue", async function (req, res) {
    try {
        let id=req.query.id;
        let catering = await connection.query("SELECT * FROM venue WHERE venue_id = ?",[id],function(error,result){
            if (result.length > 0){
                let venue = result; 
                res.render('admin/edit-venue', { venue });
            }else{
                res.render('admin/edit-venue', { venue });
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});


//delete
app.get("/admin/delete-venue", async function(req, res) {
    const Id = req.query.id;
    try {
        await connection.query("DELETE FROM venue WHERE venue_id = ?", [Id]);

        res.redirect("/admin/venue");
    } catch (error) {
        console.error("Error deleting venue:", error);
        res.redirect("/admin/venue");
    }
});

//route for the admin decor page
app.get("/admin/decor",async function(req,res){
    try {
        let venue = await connection.query("SELECT * FROM decor",function(error,result,fields){
            if (result.length > 0){
                let decor = result; 
                res.render('admin/admin-decor',{decor});
            }else{
                res.render('admin/admin-decor',{decor:0});
            }
        })
    }catch (error) {
        
        
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }

})

app.post('/admin/add-decor', upload.single('file'), encoder, function (req, res) {
    var name = req.body.name;
    var category = req.body.category;
    var price = req.body.price;
    var location = req.body.location;
    var image = "img";
    var desc = req.body.desc;

    connection.query(
        "INSERT INTO decor (decor_name, decor_category, decor_price,decor_desc) VALUES (?, ?, ?, ?)",
        [name, category, price,  desc],
        function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/admin/decor"); // Redirect back to registration page on error
            } else {
                // Get the inserted ID
                const insertedId = result.insertId;

                // Use the inserted ID to generate the filename
                const filename = insertedId + '.png';

                // Move the uploaded file to the final destination with the new filename
                fs.renameSync('public/decor/images/' + req.file.filename, 'public/decor/images/' + filename);

                // Update the database with the generated filename
                connection.query(
                    "UPDATE decor SET decor_image = ? WHERE decor_id = ?",
                    [filename, insertedId],
                    function (updateError, updateResult, updateFields) {
                        if (updateError) {
                            console.log("Error updating database with filename:", updateError);
                        } else {
                            console.log("Database updated with filename:", filename);
                        }
                        res.redirect("/admin/decor"); // Redirect to the home page or another page on successful registration
                        res.end();
                    }
                );
            }
        }
    );
});

app.post('/admin/edit-decor/:id', upload.single('file'), encoder, function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var category = req.body.category;
    var price = req.body.price;
    var desc = req.body.desc;

    // Set the existing image filename based on the id
    var existingImage = id+".png";

    // Check if a new file is uploaded
    if (req.file) {
        console.log("fileeeeeeeeeeeeeeeeeee",req.file.path,)
        // Overwrite the existing file with the new file
        fs.copyFileSync(req.file.path, 'public/decor/images/' + existingImage);

        // Optionally, delete the temporary file created by multer
        fs.unlinkSync(req.file.path);
    }

    // Update the database with the other form data
    connection.query(
        "UPDATE decor SET decor_name=?, decor_category=?, decor_price=?, decor_desc=? WHERE decor_id=?",
        [name, category, price, desc, id],
        function (updateError, updateResult, updateFields) {
            if (updateError) {
                console.log("Error updating data in the database:", updateError);
            } else {
                console.log("Database updated successfully");
            }
            res.redirect("/admin/decor"); // Redirect to the decor page
        }
    );
});

app.get("/admin/edit-decor", async function (req, res) {
    try {
        let id=req.query.id;
        let decor = await connection.query("SELECT * FROM decor WHERE decor_id = ?",[id],function(error,result){
            if (result.length > 0){
                let decor = result; 
                res.render('admin/edit-decor', { decor });
            }else{
                res.render('admin/edit-decor', { decor:0 });
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});

//delete
app.get("/admin/delete-decor", async function(req, res) {
    const Id = req.query.id;
    try {
        await connection.query("DELETE FROM decor WHERE decor_id = ?", [Id]);

        res.redirect("/admin/decor");
    } catch (error) {
        console.error("Error deleting decor:", error);
        res.redirect("/admin/decor");
    }
});

app.get("/admin/photo",async function(req,res){
    try {
        let venue = await connection.query("SELECT * FROM photo",function(error,result,fields){
            if (result.length > 0){
                let photo = result; 
                res.render('admin/admin-photo',{photo})
            }else{
                res.render('admin/admin-photo',{photo:0})
            }
        })
    }catch (error) {
        
        
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }

})

app.post('/admin/add-photo', encoder, function (req, res) {
    var name = req.body.name;
    var location = req.body.location;
    var amount = req.body.amount;
    var amount_v = req.body.amount_v;
    var desc = req.body.desc;


    // Insert data into the database
    connection.query(
        "INSERT INTO photo (photo_name, photo_location,photo_amount , video_amount,photo_desc) VALUES (?,?,?,?,?)", [name,location,amount,amount_v,desc], function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/admin/photo"); // Redirect back to registration page on error
            } else {
                res.redirect("/admin/photo");
                console.log("Registration successful!");
                 // Redirect to the home page or another page on successful registration
            }
            res.end();
        }
    );
});
app.get("/admin/edit-photo", async function (req, res) {
    try {
        let id=req.query.id;
        let photo = await connection.query("SELECT * FROM photo WHERE photo_id = ?",[id],function(error,result){
            if (result.length > 0){
                let photo = result; 
                res.render('admin/edit-photo', { photo });
            }else{
                res.render('admin/edit-photo', { photo });
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});
 
app.post("/admin/edit-photo/:id", async function (req, res) {
    try {
        let id=req.params.id;
        var name = req.body.name;
        var location = req.body.location;
        var amount = req.body.amount;
        var amount_v = req.body.amount_v;
        var desc = req.body.desc;
        let photo = await connection.query("UPDATE photo SET photo_name=?, photo_location=?,photo_amount=? , video_amount=?,photo_desc=? WHERE photo_id = ?",[name,location,amount,amount_v,desc,id],function(error,result){
                let photo = result; 
                res.redirect("/admin/photo")
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});

//delete
app.get("/admin/delete-photo", async function(req, res) {
    const Id = req.query.id;
    try {
        await connection.query("DELETE FROM photo WHERE photo_id = ?", [Id]);

        res.redirect("/admin/photo");
    } catch (error) {
        console.error("Error deleting photo:", error);
        res.redirect("/admin/photo");
    }
});

//CUSINE
app.get("/catering/cuisine", async function(req, res) {
    var caterings = await connection.query("SELECT * FROM catering", function(error, catering, fields) {
        console.log(catering.length);
        caterings = catering;
    });
    try {
        let venue = await connection.query("SELECT * FROM cuisine",async function(error,result,fields){
            
            if (result.length > 0){
                let cuisine = result; 
                
                res.render('catering/catering-cuisine', { cuisine, caterings });
            }else{
                res.render('catering/catering-cuisine', { cuisine: 0 ,caterings});

            }
        })
       
    } catch (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/catering/add-cuisine', upload.single('file'), encoder, function (req, res) {
    var catering_id=req.body.catering_id;
    var name = req.body.name;
    var category = req.body.cat;
    var price = req.body.price;
    var desc = req.body.desc;

    console.log(req.body)

    connection.query(
        "INSERT INTO cuisine ( catetring_id,cuisine_name, cuisine_category, cuisine_price,cuisine_desc) VALUES (?,?, ?, ?, ?)",
        [catering_id,name, category, price,  desc],
        function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/catering/cuisine"); // Redirect back to registration page on error
            } else {
                // Get the inserted ID
                const insertedId = result.insertId;

                // Use the inserted ID to generate the filename
                const filename = insertedId + '.png';

                // Move the uploaded file to the final destination with the new filename
                fs.renameSync('public/catering/cuisine/images/' + req.file.filename, 'public/catering/cuisine/images/' + filename);

                // Update the database with the generated filename
                connection.query(
                    "UPDATE cuisine SET cuisine_image = ? WHERE cuisine_id = ?",
                    [filename, insertedId],
                    function (updateError, updateResult, updateFields) {
                        if (updateError) {
                            console.log("Error updating database with filename:", updateError);
                        } else {
                            console.log("Database updated with filename:", filename);
                        }
                        res.redirect("/catering/cuisine"); // Redirect to the home page or another page on successful registration
                        res.end();
                    }
                );
            }
        }
    );
});

app.post('/catering/edit-cuisine/:id', upload.single('file'), encoder, function (req, res) {
    var id = req.params.id;
    var catering_id=req.body.catering_id;
    var name = req.body.name;
    var category = req.body.cat;
    var price = req.body.price;
    var desc = req.body.desc;

    // Set the existing image filename based on the id
    var existingImage = id+".png";

    // Check if a new file is uploaded
    if (req.file) {
        console.log("fileeeeeeeeeeeeeeeeeee",req.file.path,)
        // Overwrite the existing file with the new file
        fs.copyFileSync(req.file.path, 'public/catering/cuisine/images' + existingImage);
 
        // Optionally, delete the temporary file created by multer
        fs.unlinkSync(req.file.path);
    }

    // Update the database with the other form data
    connection.query(
        "UPDATE cuisine SET catetring_id=?, cuisine_name=?, cuisine_category=?, cuisine_price=?, cuisine_desc=? WHERE cuisine_id=?",
        [catering_id,name, category, price, desc, id],
        function (updateError, updateResult, updateFields) {
            if (updateError) {
                console.log("Error updating data in the database:", updateError);
            } else {
                console.log("Database updated successfully");
            }
            res.redirect("/catering/cuisine"); // Redirect to the decor page
        }
    );
});

app.get("/catering/edit-cuisine", async function (req, res) {
    var caterings = await connection.query("SELECT * FROM catering", function(error, catering, fields) {
        console.log(catering.length);
        caterings = catering;
    });
    try {
        let id=req.query.id;
        let decor = await connection.query("SELECT * FROM cuisine WHERE cuisine_id = ?",[id],function(error,result){
            if (result.length > 0){
                let cuisine = result; 
                res.render('catering/edit-cuisine', { cuisine ,caterings });
            }else{
                res.render('catering/edit-cuisine', { cuisine:0 ,caterings});
            }
        })
    }catch (error) {
        console.error("Error executing SQL query:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
});

//delete
app.get("/catering/delete-cuisine", async function(req, res) {
    const Id = req.query.id;
    try {
        await connection.query("DELETE FROM cuisine WHERE cuisine_id = ?", [Id]);

        res.redirect("/catering/cuisine");
    } catch (error) {
        console.error("Error deleting decor:", error);
        res.redirect("/catering/cuisine");
    }
});

//route for the catering dashboard page



app.get("/catering",function(req, res) {
 res.redirect("/catering/login")
})
app.get("/catering/login", function(req, res) {
   
        res.render("catering/catering-login", {
          signInErr: req.session.signInErr})
        req.session.signInErr = null;
      
})

app.get("/catering/signout", function (req, res) {
    req.session.signedIn = false;
    req.session.catering = null;
    res.redirect("/catering/login");
  });

app.get("/catering/login",function(req,res){
    res.render('catering/catering-login');
});


app.get("/catering/dashboard",async function(req,res){
    let catering=req.session.catering;
    let catId=catering.catering_id;
    console.log(req.session.catering,"llllluhuhu")
    await connection.query("SELECT * FROM booking where cateringId=?",[catId],function(error,result,fields){
        if (result.length > 0){
            let bookings = result; 
            res.render('catering/catering-dashboard', { bookings });
        }else{
            let bookings = result; 
            res.render('catering/catering-dashboard', { bookings:0 });
        }
    })
    

});

//route for the catering booking page
app.get("/catering/booking",async function(req,res){
    let catering=req.session.catering;
    let catId=catering.catering_id;
    await connection.query("SELECT * FROM booking where cateringId=?",[catId],function(error,result,fields){
        if (result.length > 0){
            let bookings = result; 
            res.render('catering/catering-booking', { bookings });
        }else{
            let bookings = result; 
            res.render('catering/catering-booking', { bookings:0 });
        }
    })
});
//route for the catering cuisine page
app.get("/catering/cuisine",function(req,res){
    res.render('catering/catering-cuisine');
});



//route for the staff dashboard page
app.get("/staff/dashboard",function(req,res){
    res.render('staff/staff-dashboard');
});
//route for the staff login page
app.get("/staff",function(req,res){
   res.redirect("/staff/login")
});
app.get("/staff/login",function(req,res){
    res.render("staff/staff-login", {
        signInErr: req.session.signInErr})
      req.session.signInErr = null;
});
app.get("/staff/signout", function (req, res) {
    req.session.signedIn = false;
    req.session.staff = null;
    res.redirect("/staff/login");
  });





// handle registration form submission-----------------------------------------------------------------------------------------------------

//user registration
app.post('/registration', encoder, function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var location = req.body.location;
    var zip = req.body.zip;
    var password = req.body.password;
    // var re_pass = req.body.re_pass;

    // Insert data into the database
    connection.query(
        "INSERT INTO user (user_name, user_email, user_phone, user_location, user_zip, user_password) VALUES (?, ?, ?, ?, ?, ?)", [name, email ,phone, location, zip, password], function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/registration"); // Redirect back to registration page on error
            } else {
                console.log("Registration successful!");
                res.redirect("/login"); // Redirect to the home page or another page on successful registration
            }
            res.end();
        }
    );
});




//registration end-----------------------------------------------------------------------------------------------------------------------------







///handle login---------------------------------------------------------------------------------------------------------------------

//admin login
app.post("/admin/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("SELECT * FROM admin WHERE admin_email = ? AND admin_password = ?",[username,password],function(error,result,fields){
        if (result.length > 0){
            req.session.signedIn = true;
            req.session.admin = result[0]; 
            res.redirect("/admin/dashboard")
         }else{
            req.session.signInErr = "Invalid email/Password";
            res.redirect("/admin/login")
         }
         res.end();
    })
})

app.post("/catering/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("SELECT * FROM catering WHERE catering_username = ? AND catering_password = ?",[username,password],function(error,result,fields){
        if (result.length > 0){
            req.session.signedIn = true;
            req.session.catering = result[0]; 
            res.redirect("/catering/dashboard")
         }else{
            console.log("Login Failed")
            req.session.signInErr = "Invalid email/Password";
            res.redirect("/catering/login")
         }
         res.end();
    })
})
//setting app port
app.listen(4000);




//user login
app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("SELECT * FROM user WHERE user_email = ? AND user_password = ?",[username,password],function(error,result,fields){

        
        if (result.length > 0){
            req.session.signedIn = true;
            req.session.user = result[0]; 
            res.redirect("/userhome")
         }else{
            console.log("Login Failed")
            req.session.signInErr = "Invalid email/Password";
            res.redirect("/login")
         }
         res.end();
    })
})

app.get("/user/booknow", async (req, res) => {
    try {
        const signedIn = req.session.signedIn;
        const user = req.session.user;

        console.log(user,"00000000")
        // Query for venues
        const venues = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM venue", (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        // Query for decor
        const decor = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM decor", (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        const cuisine = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM cuisine", (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        c
        // const cat = await new Promise((resolve, reject) => {
        //     connection.query("SELECT * FROM cuisine", (error, result) => {
        //         if (error) {
        //             reject(error);
        //         } else {
        //             resolve(result);
        //         }
        //     });
        // });

        // Query for photos (I assume you meant to query photos instead of decor again)
        const photo = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM photo", (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        // Render the view after all queries are complete
        res.render("user/booknow", { signedIn, user, venues, decor, photo,cuisine });
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.redirect("/userhome")
    }
});

app.post("/user/bookings",encoder,(req,res)=>{
    var participants = req.body.participants;
    var eventType= req.body.eventType;
    var eventMode = req.body.eventMode;
    var venueId = req.body.venueId;
    var decorId = req.body.decorId;
    var photoId = req.body.photoId;
    const selectedValue = req.body.cuisineId;
    const [cuisineId, cateringId] = selectedValue.split(' | ');
    var eventdate=req.body.eventdate;
    var userId=req.body.userId;
    var username=req.body.username;
    var userPhone=req.body.userPhone;
    var status="requsted";
   console.log(req.body,"sfsf",cateringId,"fszfzccczz",cuisineId)

    // Insert data into the database
    connection.query(
        "INSERT INTO booking (eventdate,participants, eventType, eventMode,venueId, decorId ,cuisineId,cateringId, photoId,status,userId,username,userPhone) VALUES (?, ?, ?, ?, ?,?,?,?,?,?, ?,?,?)", 
        [eventdate,participants, eventType ,eventMode, venueId, decorId,cuisineId, cateringId, photoId, status,userId,username,userPhone], function (error, result, fields) {
            if (error) {
                console.log("Error inserting data into the database:", error);
                res.redirect("/userhome"); // Redirect back to registration page on error
            } else {
                console.log("Registration successful!");
                res.redirect("/user/bookings"); // Redirect to the home page or another page on successful registration
            }
        }
    );

})



app.get("/user/bookings",async (req,res)=>{
    let signedIn= req.session.signedIn;
    let user= req.session.user;
    let id=user.user_id;
    console.log(id,"i am in userbook")
   // res.render("user/bookings",{signedIn,user})

    connection.query("SELECT * FROM booking where userId=?",[id],function(error,result,fields){
        console.log(result,id)
        if (result.length > 0){
           let bookings = result; 
            res.render("user/bookings",{signedIn,user,bookings})
         }else{
            res.render("user/bookings",{signedIn,user,bookings:0})

         }
        })

})

//catering login





//staff login
app.post("/staff/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("SELECT * FROM staff WHERE staff_username = ? AND staff_password = ?",[username,password],function(error,result,fields){
        if (result.length > 0){
            req.session.signedIn = true;
            req.session.staff = result[0]; 
            res.redirect("/staff/dashboard")
         }else{
            console.log("Login Failed")
            req.session.signInErr = "Invalid email/Password";
            res.redirect("/staff/login")
         }
         res.end();
    })
})






///login end-----------------------------------------------------------------------------------------------------------------------------------





//admin management---------------------------------------------------------------------------------------------------------------------------------

























//admin management end---------------------------------------------------------------------------------------------------------------------------