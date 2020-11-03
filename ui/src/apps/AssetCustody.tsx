import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { LocalAtm, Poll } from "@material-ui/icons";
import { SidebarEntry, getChildren } from "../components/Sidebar/SidebarEntry";
import Bond from "../pages/lifecycling/Bond";
import Derivative from "../pages/lifecycling/Derivative";
import ExerciseRequests from "../pages/exerciserequests/ExerciseRequests";
import StockSplit from "../pages/corporateactions/StockSplit";
import Dividend from "../pages/corporateactions/Dividend";
import AssetDeposit from "../pages/assetdeposits/AssetDeposit";
import Warrants from "../pages/warrants/Warrants";
import { useParty, useQuery } from "@daml/react";
import { Agent, Depository, Issuer } from "@daml.js/asset-servicing-0.0.1/lib/Roles";
import AssetDeposits from "../pages/assetdeposits/AssetDeposits";

function AssetCustody() {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const party = useParty();
  const depositories = useQuery(Depository).contracts;
  const isDepository = depositories.length > 0 && depositories[0].payload.depository === party;
  const agents = useQuery(Agent).contracts;
  const isAgent = agents.length > 0 && agents[0].payload.agent === party;
  const issuers = useQuery(Issuer).contracts;
  const isIssuer = issuers.length > 0 && issuers[0].payload.issuer === party;

  var entries : SidebarEntry[] = [];
  if (isDepository) {
    // entries.push({ label: "Settlement", path: "/apps/assetdistribution/settlement", render: () => (<SettlementInstructions />), icon: (<Poll/>), children: [] });
    // entries.push({ label: "Assets", path: "/apps/assetdistribution/assets", render: () => (<AssetDeposits />), icon: (<Poll/>), children: [] });
  } else if (isAgent) {
    entries.push({ label: "Assets", path: "/apps/assetcustody/assets", render: () => (<AssetDeposits />), icon: (<Poll/>), children: [] });
    entries.push({ label: "Warrant Exercises", path: "/apps/assetcustody/exerciserequests", render: () => <ExerciseRequests />, icon: (<LocalAtm/>), children: [] });
    // entries.push({ label: "Stock Dividends", path: "/apps/assetcustody/dividends", render: () => <Dividends />, icon: (<LocalAtm/>), children: [] });
    // entries.push({ label: "Stock Splits", path: "/apps/assetcustody/stocksplits", render: () => <StockSplits />, icon: (<CallSplit/>), children: [] });
    // entries.push({ label: "Coupons", path: "/apps/assetcustody/coupons", render: () => <Bonds />, icon: (<ConfirmationNumber/>), children: [] });
    // entries.push({ label: "Derivatives", path: "/apps/assetcustody/derivatives", render: () => <Derivatives />, icon: (<TrendingUp/>), children: [] });
  } else if (isIssuer) {
  } else {
    entries.push({ label: "Assets", path: "/apps/assetcustody/assets", render: () => (<AssetDeposits />), icon: (<Poll/>), children: [] });
    entries.push({ label: "Warrants", path: "/apps/assetcustody/warrants", render: () => (<Warrants />), icon: (<Poll/>), children: [] });
    // entries.push({ label: "Assets", path: "/apps/assetdistribution/assets", render: () => (<AssetDeposits />), icon: (<Poll/>), children: [] });
  }

  entries = entries.flatMap(e => getChildren(e).concat([e]));

  return (
    <div className={classes.root}>
      <>
        <Header app="Custody" isInitialized={true}/>
        <Sidebar entries={entries} />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route key={"deposits"} path={"/apps/assetcustody/positions/:contractId"} component={AssetDeposit} />
            <Route key={"stocksplit"} path={"/apps/assetcustody/events/stocksplits/:contractId"} component={StockSplit} />
            <Route key={"dividend"} path={"/apps/assetcustody/events/dividends/:contractId"} component={Dividend} />
            <Route key="bonds" path={"/apps/assetcustody/events/bonds/:contractId"} component={Bond} />
            <Route key="derivatives" path={"/apps/assetcustody/events/derivatives/:contractId"} component={Derivative} />
            {entries.map(e => 
              <Route exact={true} key={e.label} {...e} />
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export default withRouter(AssetCustody);
