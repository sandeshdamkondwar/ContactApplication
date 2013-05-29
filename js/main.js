var contactListObject = [
    { 
        Name: "Sandesh D", 
        Photo: 'http://lorempixel.com/100/100/people/1', 
        Address: "Jubillee Hills, Hyderabad", 
        Telephone: "0123456789", 
        Email: "sandesh@gmail.com"
    },
    { 
        Name: "Paul Irish", 
        Photo: 'http://lorempixel.com/100/100/people/2', 
        Address: "San Francisco", 
        Telephone: "0123456789", 
        Email: "paul@gmail.com"
    },
    { 
        Name: "Addy Oswani", 
        Photo: 'http://lorempixel.com/100/100/people/3', 
        Address: "London, England", 
        Telephone: "0123456789", 
        Email: "addy@gmail.com"
    },
    { 
        Name: "John Doe", 
        Photo: 'http://lorempixel.com/100/100/people/4', 
        Address: "Unknown City", 
        Telephone: "0123456789", 
        Email: "johndoe@gmail.com"
    },
    { 
        Name: "Mark Henry", 
        Photo: 'http://lorempixel.com/100/100/people/5', 
        Address: "Washington, DC", 
        Telephone: "0123456789", 
        Email: "mark@gmail.com"
    },
    { 
        Name: "Shemous", 
        Photo: 'http://lorempixel.com/100/100/people/6', 
        Address: "Washington, DC", 
        Telephone: "0123456789", 
        Email: "shemous@gmail.com"
    },
    { 
        Name: "Randy", 
        Photo: 'http://lorempixel.com/100/100/people/7', 
        Address: "Washington, DC", 
        Telephone: "0123456789", 
        Email: "randy@gmail.com"
    },
    { 
        Name: "Daniel Brian", 
        Photo: 'http://lorempixel.com/100/100/people/8', 
        Address: "Washington, DC", 
        Telephone: "0123456789", 
        Email: "daniel@gmail.com"
    }
], backUp = contactListObject;

var Contact = Backbone.Model.extend({
    defaults: {
        Photo: "./img/anonymous.png",
        Name: "John Doe",
        Email: "Email Address",
        Address: "Jubille Hills, Hyderabad",
        Telephone: "020222222"
    }
});

var ContactView = Backbone.View.extend({
    className: "contactCard row-fluid",
    template: _.template($("#contactTmpl").html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click .btnEdit": "displayEditBox",
        "click .btnDelete": "deleteContact",
        "click .saveContact": "saveContact"
    },

    displayEditBox: function () {
    	$('.editDetails').slideUp(300);
    	if(!this.$el.find('.editDetails').is(':visible')) this.$el.find('.editDetails').slideDown(300);
    },

    deleteContact: function () {
        this.model.destroy();
        this.remove();
        localStorage.setItem('contactListObject', JSON.stringify(contactsView.collection.toJSON()));
        if(contactsView.collection.length == 0){
            $('#reset').show();
        }
    },

    saveContact: function() {
        var data = {};
        data.Name = this.$el.find('.txtName').val();
        data.Address = this.$el.find('.txtAddress').val();
        data.Telephone = this.$el.find('.txtTelephone').val();
        data.Email = this.$el.find('.txtEmail').val();

        this.model.set(data);
        this.render();
        localStorage.setItem('contactListObject', JSON.stringify(contactsView.collection.toJSON()));
    }
});

var ContactsCollection = Backbone.Collection.extend({
    model: Contact
    //localStorage: new Backbone.LocalStorage("contactList")
});

var ContactsView = Backbone.View.extend({
    el: $("#contacts"),

    initialize: function () {
        //Check if available in local Storage
        if(typeof(localStorage.contactListObject) != "undefined") {
            contactListObject = JSON.parse(localStorage.getItem('contactListObject'));
            if(contactListObject.length == 0) $('#reset').show();
        }

        this.collection = new ContactsCollection(contactListObject);
        this.render();      
    },

    render: function () {
        _.each(this.collection.models, function (item) {
            this.renderContact(item);
        }, this);
    },

    renderContact: function (item) {
        var contactView = new ContactView({
            model: item
        });
        this.$el.append(contactView.render().el);
    }
});


var contactsView = new ContactsView(); 

// Create local storage
if(typeof(localStorage.contactListObject) == "undefined") {
    localStorage.setItem('contactListObject', JSON.stringify(contactsView.collection.toJSON()));
}

// Reset button event listener
$('#reset').on('click', function() {
    contactListObject = backUp;    
    localStorage.setItem('contactListObject', JSON.stringify(contactListObject));
    contactsView.collection = new ContactsCollection(contactListObject);
    contactsView.render();  
    $(this).hide();
});

$('#searchContact').on('keyup', _.debounce(function(){
    //Filter collection
}, 500));