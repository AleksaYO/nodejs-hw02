// const fs = require("fs/promises");
const path = require("path");
const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const Joi = require("joi");

const contactsPath = path.join(__dirname, "./contacts.json");

const bodyValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required(),
    phone: Joi.string().min(5).max(15).required(),
  });

  return schema.validate(data);
};

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const delContact = contacts.find((contact) => contact.id === contactId);
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return delContact;
  } else {
    console.log("Номер с таким id не найден");
  }
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };

  if (contacts.some((item) => item.phone === newContact.phone)) {
    return console.log("Такой контакт уже существует");
  } else {
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  }
};

const updateContact = async (contact, body, id) => {
  const { name, email, phone } = body;
  contact = {
    id,
    name,
    email,
    phone,
  };
  return contact;
};

const updateContacts = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  const index = contacts.findIndex((item) => item.id === contactId);
  const changeContact = await updateContact(contact, body, contactId);
  contacts.splice(index, 1, changeContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContacts,
  bodyValidator,
};
