import { query } from "../../database.js";
import {
  GET_CURRENT_PAST_BALANCE,
  GET_LAST_PAYMENT_INFORMATION,
  GET_PATIENT_INFORMATION,
  GET_OFFICE_INFORMATION,
  GET_RECENT_PAYMENTS,
  GET_DETAILS_YTD,
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
//-------------End of Overview Controller Functions----------------------------------\\

//-------------Start of Details Controller Functions----------------------------------\\
export const getDetailsYTD = async (req, res) => {
  try {
    const patientID = req.user.patientID;
    const startDate = new Date(new Date().getFullYear(), 0, 1); //Gets the January 1st of the current Year
    const endDate = new Date(); //Gets current date.

    // Format dates to 'YYYY-MM-DD' if necessary
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const detailsYTD = await query(GET_DETAILS_YTD, [
      patientID,
      formattedStartDate,
      formattedEndDate,
    ]);

    if (detailsYTD.length === 0) {
      return res
        .status(200)
        .json({ message: "No records found for this specified date range." });
    }

    res.status(200).json({ detailsYTD });

    //Make query call here.
  } catch (error) {
    console.error(
      "Error fetching patients ytd information from the server",
      error
    );
    res
      .status(500)
      .json({ message: "Server error fetching patients ytd information." });
  }
};

export const getDetailsLastYear = async () => {
  try {
    const patientID = req.user.patientID;
    const year = new Date().getFullYear() - 1;
    const startDate = new Date(year, 0, 1); //January 1st of last year
    const endDate = new Date(year, 11, 31); //December 31s of Last Year
  } catch (error) {
    console.error(
      "Error fetching patients ytd information from the server",
      error
    );
    res
      .status(500)
      .json({ message: "Server error fetching patients ytd information." });
  }
};

export const getDetailsDateRange = async () => {
  try {
    const patientID = req.user.patientID;
  } catch (error) {}
};
