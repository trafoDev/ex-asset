import React from "react";
import { useLedger, useStreamQueries } from "@daml/react";
import { Table, TableBody, TableCell, TableRow, TableHead, Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { AdmissionCheck, AdmissionCheckRequest } from "@daml.js/dsp-0.0.1/lib/DA/Finance/Issuance/Issuance";
import { ContractId } from "@daml/types";

const AdmissionChecks : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const ledger = useLedger();
  const entries = useStreamQueries(AdmissionCheckRequest).contracts;

  const respondAdmissionCheck = async (admissionCheckRequestCid : ContractId<AdmissionCheckRequest>) => {
    const admissionCheck : AdmissionCheck = { parties: true, product: true, legalDocs: true };
    await ledger.exercise(AdmissionCheckRequest.RespondAdmissionCheck, admissionCheckRequestCid, { admissionCheck });
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow className={classes.tableRow}>
          <TableCell key={0} className={classes.tableCell}>Issuance</TableCell>
          <TableCell key={1} className={classes.tableCell}>Underlying</TableCell>
          <TableCell key={2} className={classes.tableCell}>Option Type</TableCell>
          <TableCell key={3} className={classes.tableCell}>Strike</TableCell>
          <TableCell key={4} className={classes.tableCell}>Expiry</TableCell>
          <TableCell key={5} className={classes.tableCell}>Exercise Type</TableCell>
          <TableCell key={6} className={classes.tableCell}>Contract Size</TableCell>
          <TableCell key={7} className={classes.tableCell}>Issue Size</TableCell>
          <TableCell key={8} className={classes.tableCell}>Mininum Denomination</TableCell>
          <TableCell key={9} className={classes.tableCell}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((e, i) => (
          <TableRow key={i} className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>{e.payload.issuanceData.label}</TableCell>
            <TableCell key={1} className={classes.tableCell}>{e.payload.issuanceData.terms.underlying.label}</TableCell>
            <TableCell key={2} className={classes.tableCell}>{e.payload.issuanceData.terms.optionType}</TableCell>
            <TableCell key={3} className={classes.tableCell}>{e.payload.issuanceData.terms.strike}</TableCell>
            <TableCell key={4} className={classes.tableCell}>{e.payload.issuanceData.terms.expiry}</TableCell>
            <TableCell key={5} className={classes.tableCell}>{e.payload.issuanceData.terms.exerciseType}</TableCell>
            <TableCell key={6} className={classes.tableCell}>{e.payload.issuanceData.terms.contractSize}</TableCell>
            <TableCell key={7} className={classes.tableCell}>{e.payload.issuanceData.issueSize}</TableCell>
            <TableCell key={8} className={classes.tableCell}>{e.payload.issuanceData.minimumDenomination}</TableCell>
            <TableCell key={9} className={classes.tableCell}>
              <Button color="secondary" size="small" className={classes.choiceButton} variant="contained" onClick={() => respondAdmissionCheck(e.contractId)}>Confirm</Button>
              <Button color="secondary" size="small" className={classes.choiceButton} variant="contained">Reject</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>  );
}

export default withRouter(AdmissionChecks);