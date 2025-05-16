// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DyletsLoanContract
 * @dev Manages loans for solar coolers for fish traders in Kenya
 */
contract DyletsLoanContract is Ownable, ReentrancyGuard, Pausable {
    // USDC token on Base mainnet
    IERC20 public usdcToken;
    
    enum LoanStatus { Pending, Active, Paid, Defaulted }
    
    struct Loan {
        uint256 id;
        address borrower;
        uint256 principal;
        uint256 interestRate; // in basis points (1% = 100)
        uint256 termMonths;
        uint256 weeklyPayment;
        uint256 totalPaid;
        uint256 remainingBalance;
        uint256 nextPaymentDue; // timestamp
        string coolerSerialNumber;
        string coolerType;
        LoanStatus status;
        uint256 startDate;
        uint256 endDate;
    }
    
    struct Payment {
        uint256 id;
        uint256 loanId;
        uint256 amount;
        uint256 timestamp;
        string transactionHash;
    }
    
    uint256 private _loanIdCounter;
    uint256 private _paymentIdCounter;
    
    // Mappings
    mapping(uint256 => Loan) private _loans;
    mapping(address => uint256[]) private _borrowerLoans;
    mapping(uint256 => Payment[]) private _loanPayments;
    
    // Events
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 principal);
    event PaymentMade(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanStatusChanged(uint256 indexed loanId, LoanStatus status);
    
    /**
     * @dev Constructor sets the USDC token address
     * @param _usdcToken Address of the USDC token on Base
     */
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Creates a new loan
     * @param borrower Address of the borrower
     * @param principal Loan amount in USDC (6 decimals)
     * @param interestRate Annual interest rate in basis points
     * @param termMonths Loan term in months
     * @param weeklyPayment Weekly payment amount
     * @param coolerSerialNumber Serial number of the cooler
     * @param coolerType Type of the cooler
     * @return loanId The ID of the created loan
     */
    function createLoan(
        address borrower,
        uint256 principal,
        uint256 interestRate,
        uint256 termMonths,
        uint256 weeklyPayment,
        string calldata coolerSerialNumber,
        string calldata coolerType
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(borrower != address(0), "Invalid borrower address");
        require(principal > 0, "Principal must be greater than 0");
        
        uint256 loanId = _loanIdCounter++;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + (termMonths * 30 days);
        uint256 nextPaymentDue = startDate + 7 days;
        
        Loan memory newLoan = Loan({
            id: loanId,
            borrower: borrower,
            principal: principal,
            interestRate: interestRate,
            termMonths: termMonths,
            weeklyPayment: weeklyPayment,
            totalPaid: 0,
            remainingBalance: principal,
            nextPaymentDue: nextPaymentDue,
            coolerSerialNumber: coolerSerialNumber,
            coolerType: coolerType,
            status: LoanStatus.Active,
            startDate: startDate,
            endDate: endDate
        });
        
        _loans[loanId] = newLoan;
        _borrowerLoans[borrower].push(loanId);
        
        emit LoanCreated(loanId, borrower, principal);
        return loanId;
    }
    
    /**
     * @dev Process a loan payment
     * @param loanId ID of the loan
     * @param amount Payment amount in USDC
     * @param transactionHash Optional transaction hash for reference
     */
    function makePayment(
        uint256 loanId, 
        uint256 amount,
        string calldata transactionHash
    ) external nonReentrant whenNotPaused {
        Loan storage loan = _loans[loanId];
        require(loan.borrower == msg.sender, "Not the borrower");
        require(loan.status == LoanStatus.Active, "Loan is not active");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from borrower to contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDC transfer failed");
        
        // Update loan data
        loan.totalPaid += amount;
        loan.remainingBalance = loan.remainingBalance > amount ? 
                               loan.remainingBalance - amount : 0;
        loan.nextPaymentDue = block.timestamp + 7 days;
        
        // Record payment
        uint256 paymentId = _paymentIdCounter++;
        Payment memory payment = Payment({
            id: paymentId,
            loanId: loanId,
            amount: amount,
            timestamp: block.timestamp,
            transactionHash: transactionHash
        });
        
        _loanPayments[loanId].push(payment);
        
        // Check if loan is fully paid
        if (loan.remainingBalance == 0) {
            loan.status = LoanStatus.Paid;
            emit LoanStatusChanged(loanId, LoanStatus.Paid);
        }
        
        emit PaymentMade(loanId, msg.sender, amount);
    }
    
    /**
     * @dev Get loan details
     * @param loanId ID of the loan
     * @return Loan details
     */
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return _loans[loanId];
    }
    
    /**
     * @dev Get all loans for a borrower
     * @param borrower Address of the borrower
     * @return Array of loan IDs
     */
    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return _borrowerLoans[borrower];
    }
    
    /**
     * @dev Get payments for a loan
     * @param loanId ID of the loan
     * @return Array of payments
     */
    function getLoanPayments(uint256 loanId) external view returns (Payment[] memory) {
        return _loanPayments[loanId];
    }
    
    /**
     * @dev Mark a loan as defaulted (admin only)
     * @param loanId ID of the loan
     */
    function markAsDefault(uint256 loanId) external onlyOwner {
        Loan storage loan = _loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan is not active");
        
        loan.status = LoanStatus.Defaulted;
        emit LoanStatusChanged(loanId, LoanStatus.Defaulted);
    }
    
    /**
     * @dev Check if a payment is late
     * @param loanId ID of the loan
     * @return bool True if payment is late
     */
    function isPaymentLate(uint256 loanId) external view returns (bool) {
        Loan memory loan = _loans[loanId];
        return loan.status == LoanStatus.Active && block.timestamp > loan.nextPaymentDue;
    }
    
    /**
     * @dev Pause the contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw USDC from the contract (admin only)
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function withdrawUSDC(uint256 amount, address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        bool success = usdcToken.transfer(recipient, amount);
        require(success, "USDC transfer failed");
    }
}