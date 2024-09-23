import React, { Component } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants/routes";
import { Map, GoogleApiWrapper } from "google-maps-react";
import cardimage from "../../images/usflag.png";
import NavbarUser from "../Common/NavbarUser/NavbarUser";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "./PropertyDetails.css";
import usflag from "../../images/usflag.png";
import test1 from "../../images/test1.jpg";
import test2 from "../../images/test2.jpg";
import test3 from "../../images/test3.jpg";
import { addDays } from "date-fns/esm";
var momentBus = require("moment-business-days");

class PropertyDetails extends Component {
  constructor(props) {
    super(props);

    var minDay = moment(new Date()).format("YYYY-MM-DD");
    var maxDay = moment(addDays(new Date(), 365)).format("YYYY-MM-DD");

    const { city, startDate, endDate, property } = this.props.location.state;

    // console.log(city);
    // console.log(startDate);
    // console.log(endDate);
    console.log("properties: " + JSON.stringify(this.props.location.state));

    this.state = {
      email: window.localStorage.getItem("user"),
      city: city,
      startDate: startDate,
      endDate: endDate,
      // startDate: "",
      // endDate: "",
      property,
      bookedFlag: false,
      parking: false,
      estimate: 0.0,
      isEstimated: "",
      minDay: minDay,
      maxDay: maxDay
    };
    this.handleBooking = this.handleBooking.bind(this);
  }

  showEstimate = e => {
    var start = moment(
      moment(new Date(this.state.startDate)).format("YYYY-MM-DD")
    );
    var end = moment(moment(new Date(this.state.endDate)).format("YYYY-MM-DD"));
    console.log("start: ", start);
    var noOfDays = end.diff(start, "days", false) + 1;
    console.log("noOfDays: ", noOfDays);
    console.log("Parking charges: " + this.state.property);

    if (noOfDays > 0 && noOfDays < 16) {
      console.log("valid dates");
      var businessDays = momentBus(start).businessDiff(momentBus(end)) + 1;
      var holidays = noOfDays - businessDays;
      console.log("Holidays: " + holidays);

      //calculate total estimated payment

      var bRent = this.state.property.rentWeekday * businessDays;
      var hRent = this.state.property.rentWeekend * holidays;
      var parkingRent = 0.0;
      if (this.state.parking == true) {
        parkingRent = noOfDays * this.state.property.parking.dailyFee;
      }

      var totalBill = bRent + hRent + parkingRent;

      // ADD ABOVE CODE
      this.setState({
        estimate: totalBill, //totalBill
        isEstimated: true
      });
    } else {
      this.setState({
        estimate: 0.0, // Failed totalBill=0
        isEstimated: false
      });
    }
  };

  handleBooking = e => {
    e.preventDefault();

    this.showEstimate();

    console.log(this.state.property.propertyID);
    const requestBody = {
      userID: this.state.email,
      ownerID: this.state.property.ownerID,
      propertyID: this.state.property.propertyID,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      bookedPrice: this.state.estimate,
      bookedrentWeekday: this.state.property.rentWeekday,
      bookedrentWeekend: this.state.property.rentWeekend
      //username: window.localStorage.getItem(username),
      //property: property
    };

    axios
      .post(API_ENDPOINT + "/booking/new", requestBody)
      .then(response => {
        if (response.status == 200) {
          console.log("Booked successfully");
          window.alert("Property Booked Successfuly");
          this.setState({
            bookedFlag: true
          });
        }
      })
      .catch(error => {
        console.log("ERROR OBJECT", error.response.data);

        window.alert(error.response.data);
      });
  };

  estimation = () => {
    if (this.state.isEstimated === true)
      console.log("estimate:", this.state.estimate);
    return (
      <a style={{ fontSize: 12 }}>
        Your Estimated rent is: ${this.state.estimate}{" "}
      </a>
    );
    if (this.state.isEstimated === false)
      return <b style={{ fontSize: 13, color: "red" }}>Enter Valid Dates </b>;
    else return "";
  };

  render() {
    var imgLink =
      "https://firebasestorage.googleapis.com/v0/b/openhome275-9ad6a.appspot.com/o/images";
    var nameArr = this.state.property.images.split(",");
    console.log("images: " + nameArr);
    var image1 = imgLink + nameArr[0]; //active image

    //other images
    var otherImages = [];

    for (var i = 1, j = 0; i < nameArr.length; i++, j++) {
      otherImages[j] = nameArr[i];
    }

    console.log("Other images: " + otherImages);

    // var image2 = imgLink + nameArr[1];
    // var image3 = imgLink + nameArr[2];
    // console.log(image1);
    // console.log(image2);
    // console.log(image3);

    let imageCarousel = otherImages.map(imageName => {
      var imageUrl = imgLink + imageName;
      console.log("imageURL: " + imageUrl);
      return (
        <div class="carousel-item">
          <img class="d-block w-100" src={imageUrl} alt="Third slide" />
        </div>
      );
    });

    return (
      <div>
        {" "}
        <div class="detailsbackground">
          <div class="container-fluid">
            <div class="row border border-primary">
              {" "}
              <NavbarUser />
            </div>
            <div class="row border border-primary mt-3"> HELLO </div>
            <div class="row" style={{ "margin-top": "8%" }}>
              <div class="col-lg-6 col-md-6 col-sm-6 ">
                <div class="card fullproperty ml-4" style={{ width: "50rem" }}>
                  <div
                    id="carouselExampleIndicators"
                    class="carousel slide"
                    data-ride="carousel"
                  >
                    <ol class="carousel-indicators">
                      <li
                        data-target="#carouselExampleIndicators"
                        data-slide-to="0"
                        class="active"
                      ></li>
                      <li
                        data-target="#carouselExampleIndicators"
                        data-slide-to="1"
                      ></li>
                      <li
                        data-target="#carouselExampleIndicators"
                        data-slide-to="2"
                      ></li>
                    </ol>
                    <div class="carousel-inner">
                      <div class="carousel-item active">
                        <img
                          class="d-block w-100"
                          src={image1}
                          alt="First slide"
                        />
                      </div>
                      {imageCarousel}
                      {/*<div class="carousel-item">
                        <img
                          class="d-block w-100"
                          src={image2}
                          alt="Second slide"
                        />
                      </div>
                      <div class="carousel-item">
                        <img
                          class="d-block w-100"
                          src={image3}
                          alt="Third slide"
                        />
                      </div> */}
                    </div>
                    <a
                      class="carousel-control-prev"
                      href="#carouselExampleIndicators"
                      role="button"
                      data-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Previous</span>
                    </a>
                    <a
                      class="carousel-control-next"
                      href="#carouselExampleIndicators"
                      role="button"
                      data-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="sr-only">Next</span>
                    </a>
                  </div>
                  <div class="row"></div>
                  <div class="card-body">
                    <p class="card-text">
                      <p>{this.state.property.propertyName} </p>
                      <p> {this.state.property.description} </p>
                    </p>
                    <hr />
                    <table cellpadding="20px">
                      <tr>
                        <th>
                          {" "}
                          <i class="fa fa-home fa-3x iconscolor" />
                        </th>
                        <th>
                          {" "}
                          <i class="fa fa-bed fa-3x iconscolor" />
                        </th>
                        <th>
                          {" "}
                          <i class="fas fa-wifi fa-3x iconscolor"></i>
                        </th>
                        <th>
                          {" "}
                          <i class="fa fa-bath fa-3x iconscolor" />
                        </th>
                        <th>
                          {" "}
                          <i class="fa fa-building fa-3x iconscolor" />
                        </th>

                        <th>
                          {" "}
                          <i class="fas fa-parking fa-3x iconscolor"></i>
                        </th>
                      </tr>
                      <tr>
                        <td>Apartment Type</td>
                        <td>Bedrooms</td>
                        <td>Internet</td>
                        <td>Bathroom</td>
                        <td>Area</td>
                        <td> Parking </td>
                      </tr>
                      <tr>
                        <td>{this.state.property.propertyType}</td>
                        <td>{this.state.property.bedroomCount}</td>
                        <td>
                          {this.state.property.internetAvailable ? "Yes" : "No"}
                        </td>
                        <td>
                          {this.state.property.privateBathAvailable
                            ? "Yes"
                            : "No"}
                        </td>
                        <td> {this.state.property.area} </td>
                        <td>
                          {this.state.property.parking.available ? "Yes" : "No"}
                        </td>
                      </tr>
                    </table>
                    <hr />

                    {/* TABLE STARTS*/}
                    <div>
                      <table>
                        <tr>
                          <th> Sharing Type </th>
                        </tr>

                        <tr>
                          <td> {this.state.property.sharingType} </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}

                    {/* TABLE STARTS*/}
                    <div>
                      <table>
                        <tr>
                          <th> Property Area </th>
                        </tr>

                        <tr>
                          <td> {this.state.property.area} sq. ft </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}
                    {/* TABLE STARTS*/}
                    <div>
                      <table>
                        <tr>
                          <th> Bedrooms </th>
                        </tr>

                        <tr>
                          <td> {this.state.property.bedroomCount} </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}
                    {/* TABLE STARTS*/}
                    <div>
                      <table>
                        <tr>
                          <th> Private Bath / Shower </th>
                        </tr>

                        <tr align="center">
                          <td> Bath </td>
                          <td> Shower </td>
                        </tr>
                        <tr align="center">
                          <td>
                            {" "}
                            {this.state.property.privateBathAvailable
                              ? "Yes"
                              : "No"}{" "}
                          </td>
                          <td>
                            {" "}
                            {this.state.property.privateShowerAvailable
                              ? "Yes"
                              : "No"}{" "}
                          </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}

                    {/* TABLE STARTS*/}
                    <div>
                      <table>
                        <tr>
                          <th> Internet </th>
                        </tr>

                        <tr>
                          <td>
                            {" "}
                            {this.state.property.internetAvailable
                              ? "Yes"
                              : "No"}
                          </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}
                    {/* TABLE STARTS*/}
                    <div>
                      <table style={{ width: 400 }}>
                        <tr>
                          <th> Parking </th>
                        </tr>

                        <tr align="center">
                          <td> Availiablity </td>
                          <td> Paid </td>
                          <td> Charges</td>
                        </tr>
                        <tr align="center">
                          <td>
                            {this.state.property.parking.available
                              ? "Yes"
                              : "No"}
                          </td>
                          <td>
                            {this.state.property.parking.paid ? "Yes" : "No"}
                          </td>
                          <td>
                            {this.state.property.parking.paid
                              ? this.state.property.parking.dailyFee
                              : "-"}
                          </td>
                        </tr>
                      </table>
                      <hr />
                    </div>
                    {/*TABLE ENDS */}
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-2 col-sm-2"> </div>
              <div class="col-lg-4 col-md-4 col-sm-4 ">
                <div
                  class="card w-80"
                  style={{
                    "margin-top": "0%",
                    "margin-left": "24%"
                  }}
                >
                  <div class="card-body">
                    <h5 class="card-title">Booking Details</h5>
                    <div align="left" style={{ fontSize: 13 }}>
                      <a>
                        Week Days: ${this.state.property.rentWeekday} /night
                      </a>
                      <br></br>
                      <a>
                        Week End: ${this.state.property.rentWeekend} /night
                      </a>{" "}
                    </div>

                    {/* <p>
                      {" "}
                      <i class="fa fa-star starcolor" />
                      <i class="fa fa-star starcolor" />
                      <i class="fa fa-star starcolor" />
                      <i class="fa fa-star starcolor" />
                      <i class="fa fa-star-half-o starcolor" />
                      <span>14 Reviews </span>
                    </p> */}

                    {/* MY OLD CODE */}
                    <br></br>
                    <div align="left">
                      <div class="row">
                        <div class="col-lg-6 col-md-3 col-sm-12 p-0">
                          <h6>Check In</h6>
                          <input
                            type="date"
                            id="startDate"
                            min={this.state.minDay}
                            max={this.state.maxDay}
                            onChange={e => {
                              this.setState({ startDate: e.target.value });
                            }}
                            value={this.state.startDate}
                            placeholder="Start Date"
                          />
                        </div>

                        <div class="col-lg-6 col-md-3 col-sm-12 p-0">
                          <h6>Check Out</h6>
                          <input
                            type="date"
                            id="endDate"
                            min={this.state.startDate}
                            max={this.state.maxDay}
                            onChange={e => {
                              this.setState({ endDate: e.target.value });
                            }}
                            value={this.state.endDate}
                          />
                        </div>
                      </div>
                    </div>
                    {this.state.property.parking.available && (
                      <div>
                        <br></br>
                        <b>Book Parking</b>
                        <br></br>
                        <label
                          class="radio-inline"
                          style={{ paddingRight: 35 }}
                        >
                          <input
                            type="radio"
                            name="rb"
                            onClick={e => {
                              this.setState({
                                parking: true,
                                isEstimated: false
                              });
                            }}
                            value="true"
                          />
                          Yes
                        </label>
                        <label class="radio-inline">
                          <input
                            type="radio"
                            name="rb"
                            onClick={e => {
                              this.setState({
                                parking: false,
                                isEstimated: false
                              });
                            }}
                            value="false"
                          />
                          No
                        </label>
                      </div>
                    )}

                    <br></br>
                    <a
                      href="#"
                      onClick={() => this.showEstimate()}
                      style={{ fontSize: 12 }}
                    >
                      Show Estimate
                    </a>
                    <br></br>
                    {this.estimation()}
                    <br></br>

                    {!this.state.bookedFlag && (
                      <a
                        href="#"
                        class="btn btn-primary mt-4"
                        onClick={this.handleBooking}
                      >
                        Book Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PropertyDetails;
