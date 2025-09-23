/**
 * Student Portal Client-Side Application
 * Created by Stranger Bot
 * Connects to Node.js backend server for API requests
 */

class StudentPortal {
    constructor() {
        this.serverUrl = window.location.origin; // Use same origin as frontend
        this.initializeElements();
        this.bindEvents();
        this.initializeApp();
    }

    initializeElements() {
        // Form elements
        this.enrollmentInput = document.getElementById('enrollmentInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        // UI elements
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('errorMessage');
        this.successMessage = document.getElementById('successMessage');
        this.idCard = document.getElementById('idCard');
        this.studentDetails = document.getElementById('studentDetails');
        this.photoPlaceholder = document.getElementById('photoPlaceholder');
        this.studentPhoto = document.getElementById('studentPhoto');
        this.printBtn = document.getElementById('printBtn');
    }

    bindEvents() {
        // Search button click
        this.searchBtn.addEventListener('click', () => this.searchStudent());
        
        // Enter key press in input field
        this.enrollmentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchStudent();
            }
        });

        // Auto-format enrollment number
        this.enrollmentInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();
            e.target.value = value;
        });

        // Print button
        this.printBtn.addEventListener('click', () => this.printIdCard());

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeApp() {
        console.log('🚀 Student Portal initialized');
        console.log('📝 Created by Stranger Bot');
        
        // Add welcome animation
        this.addWelcomeAnimation();
        
        // Check server health
        this.checkServerHealth();
    }

    addWelcomeAnimation() {
        const portalCard = document.querySelector('.portal-card');
        if (portalCard) {
            portalCard.style.opacity = '0';
            portalCard.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                portalCard.style.transition = 'all 0.8s ease-out';
                portalCard.style.opacity = '1';
                portalCard.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    async checkServerHealth() {
        try {
            const response = await fetch(`${this.serverUrl}/health`);
            const data = await response.json();
            console.log('✅ Server status:', data.message);
        } catch (error) {
            console.warn('⚠️ Server health check failed:', error.message);
        }
    }

    async searchStudent() {
        const enrollmentNo = this.enrollmentInput.value.trim();
        
        if (!enrollmentNo) {
            this.showError('Please enter an enrollment number');
            this.focusInput();
            return;
        }

        if (!this.validateEnrollmentNumber(enrollmentNo)) {
            this.showError('Please enter a valid enrollment number format');
            this.focusInput();
            return;
        }

        this.showLoading(true);
        this.hideMessages();
        this.hideIdCard();

        try {
            console.log(`🔍 Searching for student: ${enrollmentNo}`);
            const studentData = await this.fetchStudentData(enrollmentNo);
            
            if (studentData && studentData.success) {
                console.log('✅ Student data retrieved successfully');
                this.displayStudentCard(studentData.data);
                this.showSuccess('Student details retrieved successfully!');
            } else {
                console.log('❌ No student found');
                this.showError(studentData.message || 'No student found with this enrollment number');
            }
        } catch (error) {
            console.error('❌ Error fetching student data:', error);
            this.showError('Failed to fetch student details. Please check your connection and try again.');
        } finally {
            this.showLoading(false);
        }
    }

    validateEnrollmentNumber(enrollmentNo) {
        // Basic validation - adjust pattern based on your format
        const isValidLength = enrollmentNo.length >= 5 && enrollmentNo.length <= 20;
        const hasValidCharacters = /^[A-Z0-9\-]+$/i.test(enrollmentNo);
        
        return isValidLength && hasValidCharacters;
    }

    async fetchStudentData(enrollmentNo) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                enrollmentNo: enrollmentNo
            })
        };

        console.log('📡 Making API request to:', `${this.serverUrl}/api/student`);
        
        const response = await fetch(`${this.serverUrl}/api/student`, requestOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    displayStudentCard(data) {
        if (!data || !data.StudentID) {
            this.showError('Invalid student data received from server');
            return;
        }

        console.log('🎓 Displaying student card for:', data.Name);

        // Handle student photo
        this.handleStudentPhoto(data);

        // Clear previous details
        this.studentDetails.innerHTML = '';

        // Define fields to display based on API response
        const fields = this.getStudentFields(data);

        // Create detail rows with animations
        this.createDetailRows(fields);

        // Show the ID card with animation
        this.showIdCard();
    }

    handleStudentPhoto(data) {
        if (data.imageFolderPath && data.imageFolderPath !== '') {
            // Create new image to test if it loads
            const testImage = new Image();
            
            testImage.onload = () => {
                this.studentPhoto.src = data.imageFolderPath;
                this.studentPhoto.alt = `Photo of ${data.Name}`;
                this.studentPhoto.style.display = 'block';
                this.photoPlaceholder.style.display = 'none';
                console.log('📷 Student photo loaded successfully');
            };
            
            testImage.onerror = () => {
                console.warn('⚠️ Failed to load student photo, trying backup...');
                
                // Try backup image path
                if (data.imageFolderPath1 && data.imageFolderPath1 !== data.imageFolderPath) {
                    const backupImage = new Image();
                    
                    backupImage.onload = () => {
                        this.studentPhoto.src = data.imageFolderPath1;
                        this.studentPhoto.alt = `Photo of ${data.Name}`;
                        this.studentPhoto.style.display = 'block';
                        this.photoPlaceholder.style.display = 'none';
                        console.log('📷 Backup student photo loaded');
                    };
                    
                    backupImage.onerror = () => {
                        this.showPhotoPlaceholder();
                    };
                    
                    backupImage.src = data.imageFolderPath1;
                } else {
                    this.showPhotoPlaceholder();
                }
            };
            
            testImage.src = data.imageFolderPath;
        } else {
            this.showPhotoPlaceholder();
        }
    }

    showPhotoPlaceholder() {
        this.studentPhoto.style.display = 'none';
        this.photoPlaceholder.style.display = 'flex';
        this.photoPlaceholder.innerHTML = `
            <i class="fas fa-user-graduate"></i>
            <span>Photo Not Available</span>
        `;
        console.log('📷 Using photo placeholder');
    }

    getStudentFields(data) {
        const fields = [
            { 
                label: 'Student ID', 
                value: data.StudentID || 'N/A',
                icon: 'fas fa-id-badge'
            },
            { 
                label: 'Student Name', 
                value: data.Name || 'N/A',
                icon: 'fas fa-user'
            },
            { 
                label: 'Enrollment No', 
                value: data.Enrollmentno || 'N/A',
                icon: 'fas fa-hashtag'
            },
            { 
                label: 'College Name', 
                value: data.CollegeName || 'N/A',
                icon: 'fas fa-university'
            },
            { 
                label: 'Course', 
                value: data.CourseName || 'N/A',
                icon: 'fas fa-graduation-cap'
            },
            { 
                label: 'Branch', 
                value: data.BranchName || 'N/A',
                icon: 'fas fa-code-branch'
            },
            { 
                label: 'Mobile Number', 
                value: data.MobileNo || 'N/A',
                icon: 'fas fa-phone'
            }
        ];

        // Add optional fields if available
        if (data.FatherName) {
            fields.push({ 
                label: 'Father\'s Name', 
                value: data.FatherName,
                icon: 'fas fa-male'
            });
        }
        
        if (data.Address) {
            fields.push({ 
                label: 'Address', 
                value: data.Address,
                icon: 'fas fa-map-marker-alt'
            });
        }
        
        if (data.Blood) {
            fields.push({ 
                label: 'Blood Group', 
                value: data.Blood,
                icon: 'fas fa-tint'
            });
        }
        
        if (data.Phase) {
            fields.push({ 
                label: 'Phase', 
                value: data.Phase,
                icon: 'fas fa-layer-group'
            });
        }
        
        if (data.BusRouteNo) {
            fields.push({ 
                label: 'Bus Route No', 
                value: data.BusRouteNo,
                icon: 'fas fa-bus'
            });
        }
        
        if (data.BusStop) {
            fields.push({ 
                label: 'Bus Stop', 
                value: data.BusStop,
                icon: 'fas fa-map-pin'
            });
        }

        return fields;
    }

    createDetailRows(fields) {
        fields.forEach((field, index) => {
            const row = document.createElement('div');
            row.className = 'detail-row';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            row.innerHTML = `
                <div class="detail-label">
                    <i class="${field.icon || 'fas fa-info-circle'}"></i>
                    ${field.label}:
                </div>
                <div class="detail-value">${field.value}</div>
            `;
            
            this.studentDetails.appendChild(row);
            
            // Animate row appearance
            setTimeout(() => {
                row.style.transition = 'all 0.5s ease-out';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100 + 300);
        });
    }

    printIdCard() {
        console.log('🖨️ Printing ID card...');
        
        // Add print-specific styling
        const printStyles = `
            <style media="print">
                @page { 
                    size: A4; 
                    margin: 0.5in; 
                }
                .id-card { 
                    box-shadow: none !important; 
                    border: 2px solid #000 !important;
                    page-break-inside: avoid;
                }
                .print-btn { display: none !important; }
                .footer { display: none !important; }
                .header { display: none !important; }
                .hero-section { display: none !important; }
                .search-section { display: none !important; }
                .loading, .error-message, .success-message { display: none !important; }
            </style>
        `;
        
        // Add print styles temporarily
        const head = document.getElementsByTagName('head')[0];
        const printStyleSheet = document.createElement('div');
        printStyleSheet.innerHTML = printStyles;
        head.appendChild(printStyleSheet);
        
        // Print
        window.print();
        
        // Remove print styles after printing
        setTimeout(() => {
            head.removeChild(printStyleSheet);
        }, 1000);
    }

    // UI Helper Methods
    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
        this.searchBtn.disabled = show;
        
        if (show) {
            this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        } else {
            this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Get Details';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessages();
        }, 5000);
        
        console.error('❌ Error:', message);
    }

    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.style.display = 'block';
        this.errorMessage.style.display = 'none';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessages();
        }, 5000);
        
        console.log('✅ Success:', message);
    }

    hideMessages() {
        this.errorMessage.style.display = 'none';
        this.successMessage.style.display = 'none';
    }

    showIdCard() {
        this.idCard.style.display = 'block';
        this.idCard.style.opacity = '0';
        this.idCard.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            this.idCard.style.transition = 'all 0.8s ease-out';
            this.idCard.style.opacity = '1';
            this.idCard.style.transform = 'translateY(0)';
            
            // Scroll to ID card
            this.idCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }

    hideIdCard() {
        this.idCard.style.display = 'none';
    }

    focusInput() {
        this.enrollmentInput.focus();
        this.enrollmentInput.select();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 Loading Student Portal...');
    console.log('📝 Created by Stranger Bot');
    
    // Initialize the portal
    const portal = new StudentPortal();
    
    // Make portal globally accessible for debugging
    window.StudentPortal = portal;
    
    console.log('✅ Student Portal loaded successfully!');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('📱 SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('📱 SW registration failed: ', registrationError);
            });
    });
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Back online');
});

window.addEventListener('offline', () => {
    console.log('📵 Gone offline');
});
