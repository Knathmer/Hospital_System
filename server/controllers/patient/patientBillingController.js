import { query } from "../../database.js";
import {
  GET_CURRENT_PAST_BALANCE,
  GET_LAST_PAYMENT_INFORMATION,
} from "../../queries/constants/selectQueries.js";
export const getCurrentPastBalance = async (req, res) => {
  try {
    //Extract the patientID from the token payload.
    const patientID = req.user.patientID;

    const currentAndPastDueBalance = await query(GET_CURRENT_PAST_BALANCE, [
      patientID,
    ]);

    res.status(200).json({ currentAndPastDueBalance });
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

    const lastPayment = await query(GET_LAST_PAYMENT_INFORMATION, [patientID]);

    res.status(200).json({ lastPayment });
  } catch (error) {
    console.error("Error fetching patient's last payment info. ", error);
    res
      .status(500)
      .json({ message: "Server error fetching last payment information" });
  }
};
