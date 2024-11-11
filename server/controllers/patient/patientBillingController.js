import { query } from "../../database.js";
import {
  GET_CURRENT_PAST_BALANCE,
  GET_LAST_PAYMENT_INFORMATION,
  GET_PATIENT_INFORMATION,
  GET_OFFICE_INFORMATION,
  GET_RECENT_PAYMENTS,
} from "../../queries/constants/selectQueries.js";

export const getCurrentPastBalance = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const [currentAndPastDueBalance] = await query(GET_CURRENT_PAST_BALANCE, [
      patientID,
    ]);

    const balanceData = currentAndPastDueBalance || {
      currentBalance: 0,
      pastDueBalance: 0,
    };

    res.status(200).json({ currentAndPastDueBalance: balanceData });
  } catch (error) {
    console.error(
      "Error fetching patient's current and past due balances. ",
      error
    );
    res.status(500).json({ message: "Server error fetching balances" });
  }
};

export const getLastPaymentInformation = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const [lastPayment] = await query(GET_LAST_PAYMENT_INFORMATION, [
      patientID,
    ]);

    const paymentData = lastPayment || {
      lastPaymentAmount: "N/A",
      lastPaymentDate: "No payment made",
    };

    res.status(200).json({ lastPayment: paymentData });
  } catch (error) {
    console.error("Error fetching patient's last payment info. ", error);
    res
      .status(500)
      .json({ message: "Server error fetching last payment information" });
  }
};

export const getPatientInformation = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const [patientInfo] = await query(GET_PATIENT_INFORMATION, [patientID]);

    res.status(200).json({ patientInfo });
  } catch (error) {
    console.error("Error fetching user's information from the server", error);
    res
      .status(500)
      .json({ message: "Server error fetching user's information." });
  }
};

export const getOfficeInformation = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const [officeInfo] = await query(GET_OFFICE_INFORMATION, [patientID]);

    res.status(200).json({ officeInfo: officeInfo || null });
  } catch (error) {
    console.error("Error fetching office information from the server", error);
    res
      .status(500)
      .json({ message: "Server error fetching office information." });
  }
};

export const getRecentPayments = async (req, res) => {
  try {
    const patientID = req.user.patientID;

    const recentPayments = await query(GET_RECENT_PAYMENTS, [patientID]);

    if (recentPayments.length === 0) {
      return res
        .status(200)
        .json({ recentPayments: [], message: "No payments found" });
    }

    res.status(200).json({ recentPayments });
  } catch (error) {
    console.error("Error fetching payment information from the server", error);
    res
      .status(500)
      .json({ message: "Server error fetching payment information." });
  }
};
