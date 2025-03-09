import logging
from model.api import app

if __name__ == '__main__':
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    app.run(host='0.0.0.0', port=5000, debug=False)