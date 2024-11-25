import React from "react";
import Modal from "react-bootstrap/Modal"; // Correct import method
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const AdvisorModal = ({ isOpen, advisor, onClose }) => {
  if (!advisor) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName="modal-dialog modal-dialog-scrollable"
      animation={true} // Enable animation for fade-in/fade-out
      onExited={onClose} // Trigger onClose when the fade-out completes
    >
      <Modal.Header closeButton>
        <Modal.Title className="bi bi-person-circle">
          {" "}
          {advisor.Name}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="text-center"
        style={{
          borderLeft: "12px solid white",
          borderTop: "12px solid white",
          borderBottom: "12px solid white",
        }}
      >
        <img
          src={`http://localhost:3001/${advisor.Image}`}
          alt=""
          className="rounded-2 mb-3"
          style={{ width: "150px", height: "150px" }}
        />
        <hr
          className="w-100 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <h4>DETAILS</h4>
        <hr
          className="w-25 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <p>
          <strong className="bi bi-envelope-at"> Email:</strong> {advisor.Email}
        </p>
        <p>
          <strong className="bi bi-phone"> Mobile:</strong> {advisor.Number}
        </p>
        <p>
          <strong className="bi bi-mortarboard-fill"> Expertise:</strong>{" "}
          {advisor.Expertise}
        </p>
        <p>
          <strong className="bi bi-prescription"> Experience:</strong>{" "}
          {advisor.Experience}
        </p>
        <p>
          <strong className="bi bi-calendar3"> DOB:</strong> {advisor.DOB}
        </p>
        <p>
          <strong className="bi bi-calendar-week-fill"> Age:</strong>{" "}
          {advisor.Age}
        </p>
        <p>
          <strong className="bi bi-gender-trans"> Gender:</strong>{" "}
          {advisor.Gender}
        </p>
        <p>
          <strong className="bi bi-houses-fill"> City:</strong> {advisor.City}
        </p>
        <p>
          <strong className="bi bi-house-fill"> State:</strong> {advisor.State}
        </p>
        <p>
          <strong className="bi bi-translate"> Language:</strong>{" "}
          {advisor.Language}
        </p>
        <div className="rating mb-3">
          8.6 <FontAwesomeIcon icon={faStar} style={{ color: "goldenrod" }} />
        </div>
        <hr
          className="w-100 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <h4>SKILLS</h4>
        <hr
          className="w-25 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <p>Communication Skill</p>
        <div>
          <meter
            className={`custom-meter w-50 mb-3 ${
              advisor.Communication_Strength <= 4
                ? "red-meter"
                : advisor.Communication_Strength <= 7
                ? "yellow-meter"
                : "green-meter"
            }`}
            style={{
              "--meter-value": advisor.Communication_Strength * 10 + "%",
            }}
            min="1"
            max="10"
            value={advisor.Communication_Strength}
          ></meter>
        </div>
        <p>Problem Solving Skill</p>
        <div>
          <meter
            className={`custom-meter w-50 mb-3 ${
              advisor.P_S_Strength <= 4
                ? "red-meter"
                : advisor.P_S_Strength <= 7
                ? "yellow-meter"
                : "green-meter"
            }`}
            style={{
              "--meter-value": advisor.P_S_Strength * 10 + "%",
            }}
            min="1"
            max="10"
            value={advisor.P_S_Strength}
          ></meter>
        </div>
        <p>Leadership Experience</p>
        <div>
          <meter
            className={`custom-meter w-50 mb-3 ${
              advisor.Leadership_Experience_Strength <= 4
                ? "red-meter"
                : advisor.Leadership_Experience_Strength <= 7
                ? "yellow-meter"
                : "green-meter"
            }`}
            style={{
              "--meter-value":
                advisor.Leadership_Experience_Strength * 10 + "%",
            }}
            min="1"
            max="10"
            value={advisor.Leadership_Experience_Strength}
          ></meter>
        </div>
        <hr
          className="w-100 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <h4>PERSONALITY</h4>
        <hr
          className="w-50 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <p>Analytical</p>
        <progress
          min="1"
          max="10"
          value={advisor.Analytical_Strength}
          className="ms-2"
        ></progress>
        <p>Problem Solving</p>
        <progress
          min="1"
          max="10"
          value={advisor.Problem_Solving_Strength}
          className="ms-2"
        ></progress>
        <p>Public Speaking</p>
        <progress
          min="1"
          max="10"
          value={advisor.Public_Speaking_Strength}
          className="ms-2"
        ></progress>
        <p>Adaptable</p>
        <progress
          min="1"
          max="10"
          value={advisor.Adaptable_Strength}
          className="ms-2 mb-3"
        ></progress>
        <hr
          className="w-100 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <h4>ABOUT</h4>
        <hr
          className="w-25 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <p style={{ textAlign: "justify" }}>{advisor.About}</p>
        <hr
          className="w-100 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <h4>GOAL</h4>
        <hr
          className="w-25 m-auto mb-3 rounded"
          style={{
            border: 0,
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        ></hr>
        <p style={{ textAlign: "justify" }}>{advisor.Goal}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          className="bi bi-x-lg"
          onClick={onClose}
        >
          {" "}
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdvisorModal;
