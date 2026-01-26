from flask import Flask, jsonify
from flask_cors import CORS
from config import config, Config
import os

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))
    
    # Enable CORS with origins from environment configuration
    cors_origins = Config.get_cors_origins()
    CORS(app, origins=cors_origins, 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "Accept"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    from routes.queue_routes import queue_bp
    app.register_blueprint(queue_bp)
    
    @app.route('/')
    def index():
        return jsonify({
            'service': 'Queue System',
            'status': 'running'
        })
    
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'})
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'message': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'success': False, 'message': 'Server error'}), 500
    
    return app

app = create_app()

if __name__ == '__main__':
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 5000)
    debug = app.config.get('DEBUG', True)
    app.run(host=host, port=port, debug=debug, threaded=True)
