FROM jekyll/jekyll:4.2.2

WORKDIR /srv/jekyll

# Expose Jekyll default port
EXPOSE 4000

# Start Jekyll server accessible from host
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
