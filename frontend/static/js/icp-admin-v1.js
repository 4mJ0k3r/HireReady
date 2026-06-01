const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            email: '',
            password: '',
            inviteCode: '',
            showPassword: false,
            loading: false,
            logged: false,
            testCredentials: {
                enabled: true,
                email: 'admin@icp-solution.com',
                password: 'Admin123!',
                inviteCode: 'ICP-DEMO-ADMIN'
            }
        };
    },
    mounted() {
        this.checkAuth();
        this.loadTestCredentials();
        this._authListener = () => this.checkAuth();
        window.addEventListener('auth:changed', this._authListener);
    },
    beforeUnmount() {
        if (this._authListener) window.removeEventListener('auth:changed', this._authListener);
    },
    methods: {
        checkAuth() {
            this.logged = !!(window.icp && window.icp.state && window.icp.state.token);
        },
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async loadTestCredentials() {
            try {
                const response = await axios.get(window.icp.apiUrl('/api/auth/config'));
                const cfg = response.data || {};
                this.testCredentials.enabled = !!cfg.test_credentials_enabled;
                if (cfg.test_admin_email) this.testCredentials.email = cfg.test_admin_email;
                if (cfg.test_admin_password) this.testCredentials.password = cfg.test_admin_password;
                if (cfg.test_admin_invite_code) this.testCredentials.inviteCode = cfg.test_admin_invite_code;
            } catch (_) {}
        },
        useTestCredentials() {
            this.email = this.testCredentials.email;
            this.password = this.testCredentials.password;
            this.inviteCode = this.testCredentials.inviteCode;
        },
        promptFields() {
            if (!this.email || !this.password) {
                Swal.fire({
                    icon: 'info',
                    title: 'Administrator Access',
                    text: 'Please provide valid administrator credentials to proceed.',
                    confirmButtonColor: '#8b5cf6'
                });
            }
        },
        async login() {
            if (this.loading) return;
            this.loading = true;

            Swal.fire({
                title: 'Authenticating...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                const formData = new URLSearchParams();
                formData.append('username', this.email);
                formData.append('password', this.password);
                formData.append('invite_code', this.inviteCode);

                const response = await axios.post(window.icp.apiUrl('/api/auth/admin_login'), formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    validateStatus: (status) => status < 500 // Don't reject for 4xx errors
                });

                const res = response.data;
                
                // If the response is not 200, it's a validation error or lockout
                if (response.status !== 200) {
                    let msg = res.detail || 'Invalid admin credentials';
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        html: typeof msg === 'string' ? msg.replace(/\n/g, '<br>') : JSON.stringify(msg),
                        confirmButtonColor: '#8b5cf6'
                    });
                    return;
                }

                window.icp.state.setToken(res.access_token);

                // Trigger security alert if anomaly detected
                if (res.is_anomaly && res.admin_emails && res.admin_emails.length > 0) {
                    if (window.sendSecurityAlertEmail) {
                        window.sendSecurityAlertEmail(res.admin_emails, this.email, 'Detected IP', res.alert_reason)
                            .then(result => console.log('Admin Security Alert:', result))
                            .catch(err => console.error('Admin Security Alert Error:', err));
                    }
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Access Granted',
                    text: 'Redirecting to portal...',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Encoded portal path: /static/pages/icp-admin-portal-5e6a1c3d.html
                    window.location = atob('L3N0YXRpYy9wYWdlcy9pY3AtYWRtaW4tcG9ydGFsLTVlNmExYzNkLmh0bWw=');
                });

            } catch (error) {
                let msg = 'Invalid admin credentials';
                if (error.response && error.response.data) {
                    msg = error.response.data.detail || msg;
                } else if (error.request) {
                    msg = 'Network error: Cannot reach the server.';
                } else {
                    msg = error.message;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    html: typeof msg === 'string' ? msg.replace(/\n/g, '<br>') : JSON.stringify(msg),
                    confirmButtonColor: '#8b5cf6'
                });
            } finally {
                this.loading = false;
            }
        },
        logout() {
            window.icp.logout();
        }
    }
});

app.mount('#app');
