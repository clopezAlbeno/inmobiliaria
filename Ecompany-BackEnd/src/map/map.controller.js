"use strict";

const MapPins = require("../map/map.model");

exports.addDefaultPin = async (req, res) => {
  try {
    let pin1 = {
      lat: 14.64072,
      lng: -90.49,
      name: "<b>Hello world!</b><br>I am a popup.",
    };
    let pin2 = {
      lat: 14.64072,
      lng: -90.51,
      name: "<b>Hello world!</b><br>I am a popup.",
    };
    let pin3 = {
      lat: 14.625779190644199,
      lng: -90.53612809504207,
      name: "<b>Hello world!</b><br>I am a popup.",
    };
    let existPin1 = await MapPins.findOne({ lat: pin1.lat, lng: pin1.lng });
    if (existPin1) return console.log("Defaults Pins already exists");
    let newPin1 = new MapPins(pin1);
    let newPin2 = new MapPins(pin2);
    let newPin3 = new MapPins(pin3);
    await newPin1.save();
    await newPin2.save();
    await newPin3.save();
    return console.log("Default Pins saved succesfully");
  } catch (err) {
    console.error(err);
  }
};

exports.addPin = async (req, res) => {
  try {
    let data = req.body;
    let existPin = await MapPins.findOne({ lat: data.lat, lng: data.lng });
    if (existPin)
      return res.status(302).send({ message: "Pin already exists" });
    let newPin = new MapPins(data);
    await newPin.save();
    return res.send({ message: "Pin saved succesfully" });
  } catch (err) {
    console.error(err);
    if (err.message.includes("required"))
      return res.status(500).send({ message: "Some params are required" });
    return res
      .status(500)
      .send({ message: "Error saving product", error: err.message });
  }
};

exports.getPins = async (req, res) => {
  try {
    let pins = await MapPins.find();
    if (!pins) return res.status(404).send({ message: "Pins Not founds" });
    return res.send({ pins });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Error getting pins", error: err.message });
  }
};

exports.deletePin = async (req, res) => {
  try {
    let pinId = req.params.id;
    let pin = await MapPins.findOneAndDelete({ _id: pinId });
    if (!pin) return res.status(404).send({ message: "Pins Not founds" });
    return res.send({ message: "pin deleted Succesfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Error getting pins", error: err.message });
  }
};
