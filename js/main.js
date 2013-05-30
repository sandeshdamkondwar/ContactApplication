Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

var contactListObject = 
    [{Name: "Sandesh D", Photo: './img/anonymous.png', Address: "Jubillee Hills, Hyderabad", Telephone: "9533870340", Email: "sandesh@gmail.com"}, {Name: "Paul Irish", Photo: './img/anonymous.png', Address: "San Francisco", Telephone: "998777662211", Email: "paul@gmail.com"}, {Name: "Addy Oswani", Photo: './img/anonymous.png', Address: "London, England", Telephone: "998777662211", Email: "addy@gmail.com"}, {Name: "John Doe", Photo: './img/anonymous.png', Address: "Unknown City", Telephone: "998777662211", Email: "johndoe@gmail.com"}, {Name: "Mark Henry", Photo: './img/anonymous.png', Address: "Washington, DC", Telephone: "998777662211", Email: "mark@gmail.com"}, {Name: "Shemous", Photo: './img/anonymous.png', Address: "Washington, DC", Telephone: "998777662211", Email: "shemous@gmail.com"}, {Name: "Randy", Photo: './img/anonymous.png', Address: "Washington, DC", Telephone: "998777662211", Email: "randy@gmail.com"}, {Name: "Daniel Brian", Photo: './img/anonymous.png', Address: "Washington, DC", Telephone: "998777662211", Email: "daniel@gmail.com"} ], 
    backUp = contactListObject;

var Contact = Backbone.Model.extend({
    defaults: {
        Photo: "./img/anonymous.png",
        Name: "John Doe",
        Email: "johndoe@xyz.com",
        Address: "Silicon Valley, United State",
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
        localStorage.setObject('contactListObject', contactsView.collection.toJSON());
        //localStorage.setItem('contactListObject', JSON.stringify(contactsView.collection.toJSON()));
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
        localStorage.setObject('contactListObject', contactsView.collection.toJSON());        
    }
});

var ContactsCollection = Backbone.Collection.extend({
    model: Contact
    //localStorage: new Backbone.LocalStorage("contactList")
});

var ContactsView = Backbone.View.extend({
    el: $("#contacts"),
    searchType: "Name",

    initialize: function () {
        //Check if available in local Storage
        if(typeof(localStorage.contactListObject) != "undefined") {
            contactListObject = JSON.parse(localStorage.getItem('contactListObject'));
            contactListObject = localStorage.getObject('contactListObject');
            if(contactListObject.length == 0) $('#reset').show();
        }

        this.collection = new ContactsCollection(contactListObject);
        this.render();

        this.collection.on("set", this.render, this);
        this.collection.on("reset", this.render, this);
        this.collection.on("add", this.renderContact, this);
        this.collection.on("remove", this.render, this);
    },

    events: {
        "click #reset": "resetContacts",
        "click #searchByMenu a": "changeSearchType",
        "click #btnCreate": "addNewContact",
        "keyup #searchContact": _.debounce(function(e){
            this.filterContacts(e.currentTarget.value);
        }, 500)
    },

    changeSearchType: function(el) {
        this.$el.find('#searchBy').html($(el.currentTarget).html());
        this.searchType = $(el.currentTarget).html();
    },

    removeContact: function(model) {
        model.destroy();
    },

    validateRequiredFields: function() {
        if( $.trim(this.$el.find("#addNewModal input#Name").val()) == "") {
            this.$el.find("#addNewModal input#Name").closest('.control-group').addClass('warning');
            if( $.trim(this.$el.find("#addNewModal input#Telephone").val()) == "") {
                this.$el.find("#addNewModal input#Telephone").closest('.control-group').addClass('warning')
                return false;
            }
            return false;
        }
        else if( $.trim(this.$el.find("#addNewModal input#Telephone").val()) == "") {
            this.$el.find("#addNewModal input#Telephone").closest('.control-group').addClass('warning');
            return false;
        }
        return true;
    },

    addNewContact: function () {
        if(this.validateRequiredFields() === true) {
            if(!document.getElementById('Email').validity.valid){
                alert("Email Address is not valid.");
                return;
            }
            var newContact = {};
            
            this.$el.find("#addNewModal input").each(function (i, el) {
                if ($(el).val() !== "") {
                    newContact[el.id] = $(el).val();
                }
            });

            contactsView.collection.push(newContact);
            localStorage.setObject('contactListObject', this.collection.toJSON());
            this.$el.find('#addNewModal').modal('hide');
            this.clearFields();  
            $("html, body").animate({ scrollTop: $(document).height() }, 800);  
        }
        else {
            alert("Please provide the mandatory fields.");
        }        
    },

    clearFields: function() {
        this.$el.find("#addNewModal input").each(function (i, el) {
            $(el).val("");
        });
    },

    render: function () {
        $('.contactCard').remove();
        _.each(this.collection.models, function (item) {
            this.renderContact(item);
        }, this);
    },

    renderContact: function (item) {
        var contactView = new ContactView({
            model: item
        });
        this.$el.append(contactView.render().el);
    },

    resetContacts: function (){
        contactListObject = backUp;    
        this.collection.reset(contactListObject);
        this.render();
        localStorage.setObject('contactListObject', this.collection.toJSON());
        $("#reset").hide();
    },

    filterContacts: function(value) {
        this.collection.set();
        var self = this;

        var filterType = this.filterType,
            filtered = _.filter(localStorage.getObject("contactListObject"), function (item) {

                var itemValue;
                if(self.searchType == "Name")
                    itemValue = item.Name;
                else if(self.searchType == "Address")
                    itemValue = item.Address;
                else if(self.searchType == "Email")
                    itemValue = item.Email;
                else if(self.searchType == "Telephone")
                    itemValue = item.Telephone;

                if (itemValue.toLowerCase().indexOf(value.toLowerCase()) == -1)
                    return false;
                return true;
            });
        this.collection.set(filtered);
    }
});


var contactsView = new ContactsView(); 

// Create local storage if not present
if(typeof(localStorage.contactListObject) == "undefined") {
    localStorage.setObject('contactListObject', contactsView.collection.toJSON());
}