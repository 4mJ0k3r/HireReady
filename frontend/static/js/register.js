const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            form: {
                name: localStorage.getItem('reg_name') || '',
                email: localStorage.getItem('reg_email') || '',
                password: '',
                confirmPassword: '',
                agreed: false
            },
            showPassword: false,
            showConfirmPassword: false,
            loading: false
        };
    },
    computed: {
        passwordCriteria() {
            const pwd = this.form.password;
            return {
                length: pwd.length >= 8,
                upper: /[A-Z]/.test(pwd),
                lower: /[a-z]/.test(pwd),
                number: /[0-9]/.test(pwd),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
            };
        },
        passwordStrength() {
            if (!this.form.password) return { label: 'None', color: 'text-secondary', width: '0%', class: 'bg-secondary' };
            const criteria = this.passwordCriteria;
            const metCount = Object.values(criteria).filter(Boolean).length;
            if (metCount <= 2) return { label: 'Weak', color: 'text-danger', width: '33%', class: 'bg-danger' };
            if (metCount <= 4) return { label: 'Medium', color: 'text-warning', width: '66%', class: 'bg-warning' };
            return { label: 'Strong', color: 'text-success', width: '100%', class: 'bg-success' };
        },
        passwordsMatch() {
            return this.form.password === this.form.confirmPassword;
        }
    },
    methods: {
        showTerms() { window.icp.showTerms(); },
        showPrivacy() { window.icp.showPrivacy(); },
        promptFields() {
            if (!this.form.name || !this.form.email || !this.form.password || !this.form.confirmPassword || !this.form.agreed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Incomplete Registration',
                    text: 'Please fill in all required fields (Name, Email, Password, Confirm Password) and agree to the terms to create your account.',
                    confirmButtonColor: '#8b5cf6'
                });
            } else if (!this.passwordsMatch) {
                Swal.fire({
                    icon: 'error',
                    title: 'Passwords do not match',
                    text: 'Please ensure both passwords are the same.',
                    confirmButtonColor: '#8b5cf6'
                });
            } else if (!Object.values(this.passwordCriteria).every(Boolean)) {
                const criteria = this.passwordCriteria;
                Swal.fire({
                    icon: 'warning',
                    iconHtml: 'i',
                    title: 'Invalid Password Format',
                    html: `
                        <div class="text-start small">
                            <p class="mb-2">Your password must meet all the following security criteria:</p>
                            <ul class="list-unstyled mb-0">
                                <li class="mb-1" style="color: ${criteria.length ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.length ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 8 characters
                                </li>
                                <li class="mb-1" style="color: ${criteria.upper ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.upper ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 uppercase letter
                                </li>
                                <li class="mb-1" style="color: ${criteria.lower ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.lower ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 lowercase letter
                                </li>
                                <li class="mb-1" style="color: ${criteria.number ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.number ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 number
                                </li>
                                <li class="mb-1" style="color: ${criteria.special ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.special ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 special character
                                </li>
                            </ul>
                        </div>
                    `,
                    confirmButtonColor: '#8b5cf6'
                });
            }
        },
        saveForm() {
            localStorage.setItem('reg_name', this.form.name);
            localStorage.setItem('reg_email', this.form.email);
        },
        validateName() {
            this.form.name = this.form.name.replace(/[^A-Za-z\s]/g, '');
            this.saveForm();
        },
        async register() {
            if (this.loading) return;

            if (!this.form.agreed) {
                Swal.fire({ 
                    icon: 'warning', 
                    iconHtml: 'i',
                    title: 'Agreement Required', 
                    text: 'Please agree to the Terms & Conditions and Privacy Policy to continue.', 
                    confirmButtonColor: '#8b5cf6' 
                });
                return;
            }
            
            // Validation
            if (!this.form.name.trim()) {
                Swal.fire({ icon: 'error', title: 'Name Required', text: 'Please enter your name.', confirmButtonColor: '#8b5cf6' });
                return;
            }

            if (!/^[A-Za-z\s]*$/.test(this.form.name)) {
                Swal.fire({ icon: 'error', title: 'Invalid Name', text: 'Name can only contain alphabets and spaces.', confirmButtonColor: '#8b5cf6' });
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.form.email)) {
                Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.', confirmButtonColor: '#8b5cf6' });
                return;
            }
            
            const domain = this.form.email.split('@')[1];
            if (!domain || !domain.includes('.')) {
                Swal.fire({ icon: 'error', title: 'Invalid Domain', text: 'The email domain seems invalid.', confirmButtonColor: '#8b5cf6' });
                return;
            }
            
            if (this.form.password !== this.form.confirmPassword) {
                Swal.fire({ icon: 'error', title: 'Passwords do not match', text: 'Please ensure both passwords are the same.', confirmButtonColor: '#8b5cf6' });
                return;
            }
            
            const criteria = this.passwordCriteria;
            
            if (!Object.values(criteria).every(Boolean)) {
                Swal.fire({
                    icon: 'warning',
                    iconHtml: 'i',
                    title: 'Invalid Password Format',
                    html: `
                        <div class="text-start small">
                            <p class="mb-2">Your password must meet all the following security criteria:</p>
                            <ul class="list-unstyled mb-0">
                                <li class="mb-1" style="color: ${criteria.length ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.length ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 8 characters
                                </li>
                                <li class="mb-1" style="color: ${criteria.upper ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.upper ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 uppercase letter
                                </li>
                                <li class="mb-1" style="color: ${criteria.lower ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.lower ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 lowercase letter
                                </li>
                                <li class="mb-1" style="color: ${criteria.number ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.number ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 number
                                </li>
                                <li class="mb-1" style="color: ${criteria.special ? '#22c55e' : '#ef4444'} !important;">
                                    <i class="bi ${criteria.special ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                                    At least 1 special character
                                </li>
                            </ul>
                        </div>
                    `,
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#8b5cf6'
                });
                return;
            }
            
            this.loading = true;
            Swal.fire({
                title: 'Creating Account...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            
            try {
                const response = await axios.post(window.icp.apiUrl('/api/auth/register'), {
                    email: this.form.email,
                    password: this.form.password,
                    name: this.form.name
                });
                
                const res = response.data;
                localStorage.removeItem('reg_name');
                localStorage.removeItem('reg_email');

                Swal.fire({
                    icon: 'success',
                    title: 'Account Created',
                    text: res.message || 'Your account is ready. You can now login.',
                    confirmButtonText: 'Login',
                    confirmButtonColor: '#8b5cf6'
                }).then(() => {
                    window.location = '/static/pages/login.html';
                });
                
            } catch (error) {
                let msg = 'Registration failed';
                if (error.response && error.response.data) {
                    msg = error.response.data.detail || msg;
                }
                Swal.fire({ icon: 'error', title: 'Registration Failed', html: msg.replace(/\n/g, '<br>'), confirmButtonColor: '#8b5cf6' });
            } finally {
                this.loading = false;
            }
        }
    }
});

app.mount('#app');
