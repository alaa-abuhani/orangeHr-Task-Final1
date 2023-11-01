import login from "../../support/PageObject/login";
import vacancy from "../../support/PageObject/vacancy";
import employee from "../../support/API/addEmpAPI/addEmpAPI";
import Vacancy from "../../support/API/vacancyAPI/vacancyAPI";
const loginObj: login = new login();
const empObj: employee = new employee();
let empNumber: number;
const vacancyObj: vacancy = new vacancy();
describe("vacancy functionality ", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("/");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      // add employee account via api
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
            //open vacancy tab
            vacancyObj.Vacany();
            //add vacancy for that employee
            Vacancy.addVacancy(empNumber);
          });
      });
    });
  });
  afterEach(() => {
    //deledte vacany via api
    Vacancy.deleteVacancy();
    //delete vacancy via api
    empObj.deleteEmployee();
  });

  it("vacancy: add attachment text file", () => {
    // add vacancy attachment
    Vacancy.addAtachmentVacancy();
  });
});
