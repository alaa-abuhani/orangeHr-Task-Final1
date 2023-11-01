import employee from "../../support/API/addEmpAPI/addEmpAPI";
import login from "../../support/PageObject/login";
import leave from "../../support/API/leaveAPI/leaveAPI";

const loginObj: login = new login();
const empObj: employee = new employee();
let empNumber;

describe("add employee via API", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("/");
    //admin login
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      // add employee account
      cy.get("@EmpInfo").then((EmpInfo: any) => {
        empObj
          .addEmloyeeViaAPI(
            EmpInfo.user.firstName,
            EmpInfo.user.middleName,
            EmpInfo.user.lastName,
            EmpInfo.user.empPicture,
            EmpInfo.user.id,
            EmpInfo.user.password
          )
          .then((response) => {
            empNumber = response.body.data.employee.empNumber;
            // admin add Entitlements for that employee
            leave.adminAddLeaveEntitlements(empNumber);
          });
      });
    });
  });

  it(" Leave : user add leave request  ", () => {
    cy.visit("/");
    // user login
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      loginObj.loginValid(EmpInfo.user.firstName, EmpInfo.user.password);
    });

    //user request leave
    leave.userAddRequestLeave().then((res) => {
      const id = res.body.data.id;
      //user logout
      cy.logout();
      //admin login
      cy.visit("/");
      cy.get("@logininfo").then((logininfo: any) => {
        // admin login
        loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
        // admin aprrove reject leave
        leave.adminAprroveLeave(id).then((response) => {
          //admin logout
          cy.logout();
          cy.visit("/");
          // user login
          cy.get("@EmpInfo").then((EmpInfo: any) => {
            loginObj.loginValid(EmpInfo.user.firstName, EmpInfo.user.password);
          });
          //open tab leave LeaveList
          cy.visit("/leave/viewMyLeaveList", { timeout: 3000 });
          //uset check leave status
          leave.checkLeaveAssertion();
        });
      });
    });
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });
});
