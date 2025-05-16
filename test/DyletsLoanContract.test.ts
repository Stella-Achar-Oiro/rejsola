import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("DyletsLoanContract", function () {
  let dyletsLoan: Contract;
  let mockUSDC: Contract;
  let owner: HardhatEthersSigner;
  let borrower: HardhatEthersSigner;
  let otherAccount: HardhatEthersSigner;

  const PRINCIPAL = ethers.parseUnits("350", 6); // 350 USDC
  const INTEREST_RATE = 1200; // 12% in basis points
  const TERM_MONTHS = 12;
  const WEEKLY_PAYMENT = ethers.parseUnits("8.75", 6); // 8.75 USDC
  const COOLER_SERIAL = "RS-50L-2024-001";
  const COOLER_TYPE = "RejSola Standard 50L";

  beforeEach(async function () {
    // Get signers
    [owner, borrower, otherAccount] = await ethers.getSigners();

    // Deploy mock USDC token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    
    // Mint some USDC to borrower
    await mockUSDC.mint(borrower.address, ethers.parseUnits("1000", 6));

    // Deploy DyletsLoanContract
    const DyletsLoanContract = await ethers.getContractFactory("DyletsLoanContract");
    dyletsLoan = await DyletsLoanContract.deploy(await mockUSDC.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dyletsLoan.owner()).to.equal(owner.address);
    });

    it("Should set the correct USDC token address", async function () {
      expect(await dyletsLoan.usdcToken()).to.equal(await mockUSDC.getAddress());
    });
  });

  describe("Loan Creation", function () {
    it("Should create a loan successfully", async function () {
      await expect(
        dyletsLoan.createLoan(
          borrower.address,
          PRINCIPAL,
          INTEREST_RATE,
          TERM_MONTHS,
          WEEKLY_PAYMENT,
          COOLER_SERIAL,
          COOLER_TYPE
        )
      )
        .to.emit(dyletsLoan, "LoanCreated")
        .withArgs(0, borrower.address, PRINCIPAL);

      const loan = await dyletsLoan.getLoan(0);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.principal).to.equal(PRINCIPAL);
      expect(loan.interestRate).to.equal(INTEREST_RATE);
      expect(loan.termMonths).to.equal(TERM_MONTHS);
      expect(loan.weeklyPayment).to.equal(WEEKLY_PAYMENT);
      expect(loan.coolerSerialNumber).to.equal(COOLER_SERIAL);
      expect(loan.coolerType).to.equal(COOLER_TYPE);
      expect(loan.status).to.equal(1); // Active
    });

    it("Should fail if not called by owner", async function () {
      await expect(
        dyletsLoan.connect(borrower).createLoan(
          borrower.address,
          PRINCIPAL,
          INTEREST_RATE,
          TERM_MONTHS,
          WEEKLY_PAYMENT,
          COOLER_SERIAL,
          COOLER_TYPE
        )
      ).to.be.revertedWithCustomError(dyletsLoan, "OwnableUnauthorizedAccount");
    });
  });

  describe("Loan Payments", function () {
    beforeEach(async function () {
      // Create a loan
      await dyletsLoan.createLoan(
        borrower.address,
        PRINCIPAL,
        INTEREST_RATE,
        TERM_MONTHS,
        WEEKLY_PAYMENT,
        COOLER_SERIAL,
        COOLER_TYPE
      );

      // Approve USDC spending
      await mockUSDC.connect(borrower).approve(await dyletsLoan.getAddress(), WEEKLY_PAYMENT);
    });

    it("Should process payment successfully", async function () {
      await expect(
        dyletsLoan.connect(borrower).makePayment(0, WEEKLY_PAYMENT, "")
      )
        .to.emit(dyletsLoan, "PaymentMade")
        .withArgs(0, borrower.address, WEEKLY_PAYMENT);

      const loan = await dyletsLoan.getLoan(0);
      expect(loan.totalPaid).to.equal(WEEKLY_PAYMENT);
      expect(loan.remainingBalance).to.equal(PRINCIPAL - WEEKLY_PAYMENT);
    });

    it("Should fail if payment made by non-borrower", async function () {
      await expect(
        dyletsLoan.connect(otherAccount).makePayment(0, WEEKLY_PAYMENT, "")
      ).to.be.revertedWith("Not the borrower");
    });

    it("Should mark loan as paid when fully repaid", async function () {
      // Make a payment equal to the principal
      await mockUSDC.connect(borrower).approve(await dyletsLoan.getAddress(), PRINCIPAL);
      
      await expect(
        dyletsLoan.connect(borrower).makePayment(0, PRINCIPAL, "")
      )
        .to.emit(dyletsLoan, "LoanStatusChanged")
        .withArgs(0, 2); // Paid status

      const loan = await dyletsLoan.getLoan(0);
      expect(loan.status).to.equal(2); // Paid
      expect(loan.remainingBalance).to.equal(0);
    });
  });

  describe("Loan Management", function () {
    beforeEach(async function () {
      // Create a loan
      await dyletsLoan.createLoan(
        borrower.address,
        PRINCIPAL,
        INTEREST_RATE,
        TERM_MONTHS,
        WEEKLY_PAYMENT,
        COOLER_SERIAL,
        COOLER_TYPE
      );
    });

    it("Should get borrower loans", async function () {
      const loans = await dyletsLoan.getBorrowerLoans(borrower.address);
      expect(loans.length).to.equal(1);
      expect(loans[0]).to.equal(0);
    });

    it("Should mark loan as defaulted", async function () {
      await expect(dyletsLoan.markAsDefault(0))
        .to.emit(dyletsLoan, "LoanStatusChanged")
        .withArgs(0, 3); // Defaulted status

      const loan = await dyletsLoan.getLoan(0);
      expect(loan.status).to.equal(3); // Defaulted
    });

    it("Should check if payment is late", async function () {
      // Advance time by 8 days
      await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const isLate = await dyletsLoan.isPaymentLate(0);
      expect(isLate).to.be.true;
    });
  });

  describe("Emergency Controls", function () {
    it("Should pause and unpause the contract", async function () {
      await dyletsLoan.pause();
      expect(await dyletsLoan.paused()).to.be.true;

      // Try to create a loan while paused
      await expect(
        dyletsLoan.createLoan(
          borrower.address,
          PRINCIPAL,
          INTEREST_RATE,
          TERM_MONTHS,
          WEEKLY_PAYMENT,
          COOLER_SERIAL,
          COOLER_TYPE
        )
      ).to.be.revertedWith("Pausable: paused");

      await dyletsLoan.unpause();
      expect(await dyletsLoan.paused()).to.be.false;

      // Should work after unpausing
      await expect(
        dyletsLoan.createLoan(
          borrower.address,
          PRINCIPAL,
          INTEREST_RATE,
          TERM_MONTHS,
          WEEKLY_PAYMENT,
          COOLER_SERIAL,
          COOLER_TYPE
        )
      ).to.not.be.reverted;
    });

    it("Should allow owner to withdraw USDC", async function () {
      // First make a payment to get some USDC in the contract
      await dyletsLoan.createLoan(
        borrower.address,
        PRINCIPAL,
        INTEREST_RATE,
        TERM_MONTHS,
        WEEKLY_PAYMENT,
        COOLER_SERIAL,
        COOLER_TYPE
      );

      await mockUSDC.connect(borrower).approve(await dyletsLoan.getAddress(), WEEKLY_PAYMENT);
      await dyletsLoan.connect(borrower).makePayment(0, WEEKLY_PAYMENT, "");

      const initialBalance = await mockUSDC.balanceOf(owner.address);
      
      // Withdraw USDC
      await dyletsLoan.withdrawUSDC(WEEKLY_PAYMENT, owner.address);
      
      const finalBalance = await mockUSDC.balanceOf(owner.address);
      expect(finalBalance - initialBalance).to.equal(WEEKLY_PAYMENT);
    });
  });
});